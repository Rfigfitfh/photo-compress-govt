import Pica from 'pica';
import { CompressionOptions, CompressionResult } from '../types';
import { calculateTargetDimensions, isWithinSpec, setJpegDpiInBuffer, padJpegBufferToMinKB } from './imageMath';

// Pica singleton instance configured with WebAssembly and Web Workers
const picaInstance = Pica({
  features: ['js', 'wasm', 'ww'],
});

/**
 * Loads an image from a File or Data URL into an HTMLImageElement
 */
export function loadImage(src: string | File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    if (typeof src === 'string') {
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(new Error('Failed to load image from string: ' + e));
      img.src = src;
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(new Error('Failed to load image file'));
        img.src = reader.result as string;
      };
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(src);
    }
  });
}

/**
 * Draws an image into a target canvas area using 'cover' (center-cropped) or 'contain' (centered with white padding).
 * This prevents facial and signature distortion when upload aspect ratios differ from exam specs.
 */
export function drawImageFitted(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  srcW: number,
  srcH: number,
  targetW: number,
  targetH: number,
  mode: 'cover' | 'contain' = 'cover'
): void {
  if (srcW <= 0 || srcH <= 0 || targetW <= 0 || targetH <= 0) return;

  let renderW = targetW;
  let renderH = targetH;
  let offsetX = 0;
  let offsetY = 0;

  if (mode === 'cover') {
    // Fill bounding box, crop excess (standard for candidate portrait photos)
    const scale = Math.max(targetW / srcW, targetH / srcH);
    renderW = srcW * scale;
    renderH = srcH * scale;
    offsetX = (targetW - renderW) / 2;
    offsetY = (targetH - renderH) / 2;
  } else {
    // Fit within bounding box, pad with background (standard for candidate signatures & thumbs)
    const scale = Math.min(targetW / srcW, targetH / srcH);
    renderW = srcW * scale;
    renderH = srcH * scale;
    offsetX = (targetW - renderW) / 2;
    offsetY = (targetH - renderH) / 2;
  }

  ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
}

/**
 * High-Fidelity Signature Resizing using Pica.js
 * Uses Lanczos3 high-order sinc window resampling with built-in unsharp masking.
 * Replaces standard Canvas downscaling to preserve ultra-fine signature strokes and ink details,
 * completely eliminating blurriness on small 140x60 px and 300x120 px government portal formats.
 */
export async function resizeSignatureWithPica(
  sourceImage: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
  options?: {
    unsharpAmount?: number;
    unsharpRadius?: number;
    unsharpThreshold?: number;
    applyInkEnhancement?: boolean;
    inkBoost?: number;
  }
): Promise<HTMLCanvasElement> {
  // Step 1: Calculate contain-fit dimensions to preserve signature aspect ratio perfectly
  const scale = Math.min(targetWidth / sourceWidth, targetHeight / sourceHeight);
  const fittedW = Math.max(1, Math.round(sourceWidth * scale));
  const fittedH = Math.max(1, Math.round(sourceHeight * scale));

  // Step 2: Render source onto a clean source canvas with white background
  const srcCanvas = document.createElement('canvas');
  srcCanvas.width = sourceWidth;
  srcCanvas.height = sourceHeight;
  const sCtx = srcCanvas.getContext('2d', { willReadFrequently: true })!;
  sCtx.fillStyle = '#FFFFFF';
  sCtx.fillRect(0, 0, sourceWidth, sourceHeight);
  sCtx.drawImage(sourceImage, 0, 0, sourceWidth, sourceHeight);

  // Step 3: Pica target canvas sized to fitted dimensions
  const picaTargetCanvas = document.createElement('canvas');
  picaTargetCanvas.width = fittedW;
  picaTargetCanvas.height = fittedH;

  // Step 4: Perform Lanczos3 resampling with Pica
  try {
    await picaInstance.resize(srcCanvas, picaTargetCanvas, {
      filter: 'lanczos3',
      unsharpAmount: options?.unsharpAmount ?? 110,
      unsharpRadius: options?.unsharpRadius ?? 0.6,
      unsharpThreshold: options?.unsharpThreshold ?? 2,
    });
  } catch (err) {
    console.warn('Pica resize fallback to step-down:', err);
    return progressiveStepDown(sourceImage, sourceWidth, sourceHeight, targetWidth, targetHeight);
  }

  // Step 5: Center fitted Pica result onto final target canvas with pure #FFFFFF background
  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = targetWidth;
  finalCanvas.height = targetHeight;
  const fCtx = finalCanvas.getContext('2d', { willReadFrequently: true })!;
  fCtx.fillStyle = '#FFFFFF';
  fCtx.fillRect(0, 0, targetWidth, targetHeight);

  const offsetX = Math.round((targetWidth - fittedW) / 2);
  const offsetY = Math.round((targetHeight - fittedH) / 2);
  fCtx.drawImage(picaTargetCanvas, offsetX, offsetY, fittedW, fittedH);

  // Step 6: If ink enhancement is enabled, whiten background paper to pure #FFFFFF and deepen ink
  if (options?.applyInkEnhancement !== false) {
    applyLuminanceInkEnhancer(fCtx, targetWidth, targetHeight, options?.inkBoost ?? 2);
  }

  return finalCanvas;
}

/**
 * Progressive Step-Down Resizing (Fallback)
 * Downsamples high-resolution user uploads to target dimensions (e.g. 140x60 px)
 * in progressive 50% steps with high smoothing quality.
 * Prevents stroke aliasing, pixel dropouts, and blurry line smearing.
 */
export function progressiveStepDown(
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number
): HTMLCanvasElement {
  let curW = sourceWidth;
  let curH = sourceHeight;

  // Step 0: Initial high-quality canvas copy with contain fit to preserve aspect ratio
  let curCanvas = document.createElement('canvas');
  curCanvas.width = curW;
  curCanvas.height = curH;
  let curCtx = curCanvas.getContext('2d', { willReadFrequently: true })!;
  curCtx.imageSmoothingEnabled = true;
  curCtx.imageSmoothingQuality = 'high';
  curCtx.fillStyle = '#FFFFFF';
  curCtx.fillRect(0, 0, curW, curH);
  drawImageFitted(curCtx, source, sourceWidth, sourceHeight, curW, curH, 'contain');

  // Progressive half-step downsampling loop
  while (curW * 0.5 >= targetWidth && curH * 0.5 >= targetHeight) {
    const nextW = Math.max(targetWidth, Math.round(curW * 0.5));
    const nextH = Math.max(targetHeight, Math.round(curH * 0.5));

    const stepCanvas = document.createElement('canvas');
    stepCanvas.width = nextW;
    stepCanvas.height = nextH;
    const stepCtx = stepCanvas.getContext('2d', { willReadFrequently: true })!;
    stepCtx.imageSmoothingEnabled = true;
    stepCtx.imageSmoothingQuality = 'high';
    stepCtx.fillStyle = '#FFFFFF';
    stepCtx.fillRect(0, 0, nextW, nextH);
    stepCtx.drawImage(curCanvas, 0, 0, nextW, nextH);

    curCanvas = stepCanvas;
    curW = nextW;
    curH = nextH;
  }

  // Final step to exact target dimensions
  if (curW !== targetWidth || curH !== targetHeight) {
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = targetWidth;
    finalCanvas.height = targetHeight;
    const finalCtx = finalCanvas.getContext('2d', { willReadFrequently: true })!;
    finalCtx.imageSmoothingEnabled = true;
    finalCtx.imageSmoothingQuality = 'high';
    finalCtx.fillStyle = '#FFFFFF';
    finalCtx.fillRect(0, 0, targetWidth, targetHeight);
    finalCtx.drawImage(curCanvas, 0, 0, targetWidth, targetHeight);
    return finalCanvas;
  }

  return curCanvas;
}

/**
 * Stage 2: 3x3 Light Sharpen Filter
 * Crisp edge enhancement without halo artifacts or unnatural heavy blackening.
 * Convolution kernel:
 *   [  0,   -s,   0  ]
 *   [ -s, 1+4s,  -s  ]
 *   [  0,   -s,   0  ]
 */
export function apply3x3LightSharpen(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  strength: number = 0.22
): void {
  const imgData = ctx.getImageData(0, 0, width, height);
  const src = imgData.data;
  const copy = new Uint8ClampedArray(src);

  const kCenter = 1 + 4 * strength;
  const kEdge = -strength;

  for (let y = 0; y < height; y++) {
    const yUp = Math.max(0, y - 1);
    const yDown = Math.min(height - 1, y + 1);

    for (let x = 0; x < width; x++) {
      const xLeft = Math.max(0, x - 1);
      const xRight = Math.min(width - 1, x + 1);

      const idx = (y * width + x) * 4;
      const idxL = (y * width + xLeft) * 4;
      const idxR = (y * width + xRight) * 4;
      const idxU = (yUp * width + x) * 4;
      const idxD = (yDown * width + x) * 4;

      for (let c = 0; c < 3; c++) {
        const val =
          copy[idx + c] * kCenter +
          (copy[idxL + c] + copy[idxR + c] + copy[idxU + c] + copy[idxD + c]) * kEdge;
        src[idx + c] = Math.max(0, Math.min(255, Math.round(val)));
      }
      src[idx + 3] = copy[idx + 3];
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

/**
 * Stage 3: Luminance Ink Enhancer
 * Removes previous heavy dilation and harsh forced blackening.
 * 1. Analyzes background paper luminance baseline.
 * 2. Whitens paper background to pure #FFFFFF, stripping yellow scan tint & shadow haze.
 * 3. Naturally enhances ink stroke contrast curve preserving pen ink colors (black or blue)
 *    with smooth anti-aliased transitions. No morphological stroke thickening/dilation.
 */
export function applyLuminanceInkEnhancer(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  inkMode: number = 2 // 1 = Natural, 2 = Crisp, 3 = Enhanced Contrast
): void {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const totalPixels = width * height;

  // Calculate luminance for all pixels
  const lums = new Float32Array(totalPixels);
  let paperLumSum = 0;
  let paperSampleCount = 0;

  for (let i = 0; i < totalPixels; i++) {
    const p = i * 4;
    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    lums[i] = lum;

    if (lum > 140) {
      paperLumSum += lum;
      paperSampleCount++;
    }
  }

  const avgPaperLum = paperSampleCount > 0 ? paperLumSum / paperSampleCount : 240;
  // Adaptive threshold for paper background
  const paperCutoff = Math.max(160, Math.min(242, avgPaperLum * 0.90));
  const inkThreshold = paperCutoff - 18;

  // Gentle contrast boost factor (NO dilation)
  const boost = inkMode === 1 ? 0.35 : inkMode === 3 ? 0.70 : 0.50;

  for (let i = 0; i < totalPixels; i++) {
    const p = i * 4;
    const lum = lums[i];
    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];

    if (lum >= paperCutoff) {
      // Background paper -> pure clean white
      data[p] = 255;
      data[p + 1] = 255;
      data[p + 2] = 255;
      data[p + 3] = 255;
    } else if (lum > inkThreshold) {
      // Soft anti-aliasing transition between ink and paper
      const t = (lum - inkThreshold) / (paperCutoff - inkThreshold);
      data[p] = Math.round(r + (255 - r) * t);
      data[p + 1] = Math.round(g + (255 - g) * t);
      data[p + 2] = Math.round(b + (255 - b) * t);
      data[p + 3] = 255;
    } else {
      // Ink stroke: naturally deepen tone without artificial dilation or blotchiness
      const isBlueInk = b > r + 15 && b > 60;
      const darkness = (inkThreshold - lum) / inkThreshold;

      if (isBlueInk) {
        // Preserve and deepen blue ballpoint / gel pen tone
        const blueFactor = Math.pow(darkness, 0.8) * boost;
        data[p] = Math.max(10, Math.round(r * (1 - blueFactor * 0.8)));
        data[p + 1] = Math.max(20, Math.round(g * (1 - blueFactor * 0.6)));
        data[p + 2] = Math.min(225, Math.max(70, Math.round(b * (1 - blueFactor * 0.15) + 12)));
      } else {
        // Natural crisp black / charcoal ink
        const darkFactor = Math.pow(darkness, 0.75) * boost;
        data[p] = Math.max(18, Math.round(r * (1 - darkFactor)));
        data[p + 1] = Math.max(18, Math.round(g * (1 - darkFactor)));
        data[p + 2] = Math.max(18, Math.round(b * (1 - darkFactor)));
      }
      data[p + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

/**
 * Boosts fingerprint ridges and clears stamp pad paper background
 */
function applyThumbCleanUp(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    // Enhance dark blue/black ink ridges
    if (lum > 210) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    } else {
      // Deepen ridges
      data[i] = Math.max(0, Math.round(r * 0.8));
      data[i + 1] = Math.max(0, Math.round(g * 0.8));
      data[i + 2] = Math.max(0, Math.round(b * 0.85));
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

/**
 * Draws candidate Name and Date of Taking Photo (DOP) on a crisp white bottom banner
 */
function renderNameDateStrip(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  candidateName: string,
  dateOfPhoto: string
) {
  const bannerHeight = Math.max(34, Math.round(height * 0.18));
  const bannerY = height - bannerHeight;

  // White background banner with sharp top separator
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, bannerY, width, bannerHeight);

  ctx.strokeStyle = '#D1D5DB';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, bannerY);
  ctx.lineTo(width, bannerY);
  ctx.stroke();

  // Typography
  ctx.fillStyle = '#111827';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const fontSizeName = Math.max(10, Math.round(bannerHeight * 0.32));
  const fontSizeDate = Math.max(9, Math.round(bannerHeight * 0.28));

  ctx.font = `bold ${fontSizeName}px sans-serif`;
  ctx.fillText(candidateName.toUpperCase(), width / 2, bannerY + bannerHeight * 0.35);

  ctx.font = `600 ${fontSizeDate}px sans-serif`;
  ctx.fillText(`D.O.P: ${dateOfPhoto}`, width / 2, bannerY + bannerHeight * 0.72);
}

/**
 * Converts canvas to Blob promise using Pica.js with fallback to native canvas
 */
async function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality: number): Promise<Blob> {
  try {
    return await picaInstance.toBlob(canvas, mimeType, quality);
  } catch {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas toBlob failed'));
        },
        mimeType,
        quality
      );
    });
  }
}

/**
 * Main Client-Side Compression & Resizing engine
 */
export async function compressImage(
  imageSource: File | Blob | string,
  options: CompressionOptions
): Promise<CompressionResult> {
  const img = await loadImage(imageSource);

  let currentW = options.targetWidth || img.naturalWidth;
  let currentH = options.targetHeight || img.naturalHeight;

  const targetDims = calculateTargetDimensions(
    img.naturalWidth,
    img.naturalHeight,
    options.targetWidth,
    options.targetHeight,
    options.lockAspectRatio !== false,
    options.minWidth,
    options.minHeight,
    options.maxWidth,
    options.maxHeight
  );

  currentW = targetDims.width;
  currentH = targetDims.height;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Canvas 2D context is not supported');
  }

  const mimeType = options.format || 'image/jpeg';
  const targetMinKB = options.minKB || 10;
  const targetMaxKB = options.maxKB || 50;
  const targetKB = options.targetKB || Math.round((targetMinKB + targetMaxKB) / 2);

  let quality = options.quality !== undefined ? options.quality : 0.85;
  let finalBlob: Blob | null = null;
  let finalQuality = quality;

  // Render loop with potential downscale if maxKB exceeded even at low quality
  let scaleAttempts = 0;
  const maxScaleAttempts = 4;

  while (scaleAttempts < maxScaleAttempts) {
    canvas.width = currentW;
    canvas.height = currentH;

    // Fill white background (crucial for transparent PNG conversion to JPG)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, currentW, currentH);

    // Draw image with Pica.js for Signatures, thumb clean, declaration or standard photo
    if (options.cleanSignature || options.isSignature) {
      // Signature resizing using Pica.js with Lanczos3 filter and unsharp masking
      const picaCanvas = await resizeSignatureWithPica(
        img,
        img.naturalWidth,
        img.naturalHeight,
        currentW,
        currentH,
        {
          unsharpAmount: options.inkBoost === 3 ? 150 : options.inkBoost === 1 ? 80 : 115,
          unsharpRadius: 0.6,
          unsharpThreshold: 2,
          applyInkEnhancement: options.cleanSignature !== false,
          inkBoost: options.inkBoost || 2,
        }
      );
      ctx.drawImage(picaCanvas, 0, 0, currentW, currentH);
    } else if (options.cleanThumb) {
      // Clean thumb impression with contain fit on white background
      drawImageFitted(ctx, img, img.naturalWidth, img.naturalHeight, currentW, currentH, 'contain');
      applyThumbCleanUp(ctx, currentW, currentH);
    } else if (options.isDeclaration) {
      // Handwritten Declaration: contain fit on white background so candidate handwriting lines are never cropped
      drawImageFitted(ctx, img, img.naturalWidth, img.naturalHeight, currentW, currentH, 'contain');
      apply3x3LightSharpen(ctx, currentW, currentH, 0.16);
    } else {
      // Standard drawing for photos: center-crop (cover) so faces are never squashed
      drawImageFitted(ctx, img, img.naturalWidth, img.naturalHeight, currentW, currentH, 'cover');
    }

    if (options.addNameDate && options.candidateName && options.dateOfPhoto) {
      renderNameDateStrip(ctx, currentW, currentH, options.candidateName, options.dateOfPhoto);
    }

    // Binary search for exact target KB if JPEG
    if (mimeType === 'image/jpeg') {
      let low = 0.05;
      let high = 0.98;
      let bestBlob: Blob | null = null;
      let bestDiff = Infinity;
      let bestQ = 0.85;

      let bestValidBlob: Blob | null = null;
      let bestValidDiff = Infinity;
      let bestValidQ = 0.85;

      for (let iter = 0; iter < 8; iter++) {
        const testQ = (low + high) / 2;
        const b = await canvasToBlob(canvas, mimeType, testQ);
        const kb = b.size / 1024;
        const diff = Math.abs(kb - targetKB);

        if (diff < bestDiff) {
          bestDiff = diff;
          bestBlob = b;
          bestQ = testQ;
        }

        // Keep track of best blob that strictly does NOT exceed targetMaxKB
        if (kb <= targetMaxKB) {
          if (diff < bestValidDiff) {
            bestValidDiff = diff;
            bestValidBlob = b;
            bestValidQ = testQ;
          }
        }

        // Check if within bounds
        if (kb > targetMaxKB) {
          high = testQ;
        } else if (kb < targetMinKB && high > low + 0.04) {
          low = testQ;
        } else {
          // Inside target range! Adjust towards targetKB
          if (kb > targetKB) high = testQ;
          else low = testQ;
        }
      }

      // Prioritize valid blob that strictly satisfies <= targetMaxKB
      if (bestValidBlob) {
        finalBlob = bestValidBlob;
        finalQuality = bestValidQ;
      } else {
        finalBlob = bestBlob;
        finalQuality = bestQ;
      }

      // Fallback: If still exceeding maxKB even after binary search
      if (finalBlob && finalBlob.size / 1024 > targetMaxKB) {
        const lowQBlob = await canvasToBlob(canvas, mimeType, 0.02);
        if (lowQBlob.size / 1024 <= targetMaxKB) {
          finalBlob = lowQBlob;
          finalQuality = 0.02;
        } else if (scaleAttempts + 1 < maxScaleAttempts) {
          currentW = Math.max(80, Math.round(currentW * 0.9));
          currentH = Math.max(40, Math.round(currentH * 0.9));
          scaleAttempts++;
          continue;
        }
      }
    } else {
      // PNG format
      finalBlob = await canvasToBlob(canvas, mimeType, 1.0);
    }

    break;
  }

  if (!finalBlob) {
    finalBlob = await canvasToBlob(canvas, mimeType, 0.8);
  }

  // Process JPEG binary adjustments: DPI tag before padding
  if (mimeType === 'image/jpeg') {
    let arrayBuffer = await finalBlob.arrayBuffer();

    if (options.dpi) {
      arrayBuffer = setJpegDpiInBuffer(arrayBuffer, options.dpi);
    }

    // Pad toward requested targetKB (or minimum allowed minKB, bounded between minKB and maxKB)
    const effectiveMinKB = Math.max(targetMinKB, Math.min(targetKB, targetMaxKB));
    if (finalBlob.size / 1024 < effectiveMinKB) {
      const neededBytes = Math.round(effectiveMinKB * 1024);
      arrayBuffer = padJpegBufferToMinKB(arrayBuffer, neededBytes);
    }

    finalBlob = new Blob([arrayBuffer], { type: mimeType });
  }

  const finalSizeKB = Math.round((finalBlob.size / 1024) * 10) / 10;
  const dataUrl = URL.createObjectURL(finalBlob);

  const specCheck = isWithinSpec(
    finalSizeKB,
    targetMinKB,
    targetMaxKB,
    currentW,
    currentH,
    options.targetWidth,
    options.targetHeight,
    {
      minWidth: options.minWidth,
      minHeight: options.minHeight,
      maxWidth: options.maxWidth,
      maxHeight: options.maxHeight,
      exactWidth: options.exactWidth,
      exactHeight: options.exactHeight,
    }
  );

  return {
    dataUrl,
    blob: finalBlob,
    sizeBytes: finalBlob.size,
    sizeKB: finalSizeKB,
    width: currentW,
    height: currentH,
    mimeType,
    format: mimeType === 'image/jpeg' ? 'JPG' : 'PNG',
    qualityUsed: Math.round(finalQuality * 100),
    passesSpec: specCheck.passes,
    specFeedback: specCheck.feedback,
  };
}

/**
 * Generates instant realistic sample assets for testing without user uploads
 */
export function generateSampleCanvas(
  type: 'photo' | 'signature' | 'thumb' | 'declaration',
  candidateName = 'ANANYA SHARMA',
  dateStr = '29-10-2026'
): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  if (type === 'photo') {
    canvas.width = 400;
    canvas.height = 500;

    // Gradient studio photo background (soft grey/white)
    const bg = ctx.createLinearGradient(0, 0, 0, 500);
    bg.addColorStop(0, '#FFFFFF');
    bg.addColorStop(1, '#EAECEF');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 400, 500);

    // Shoulders & Shirt
    ctx.fillStyle = '#2B3A4A';
    ctx.beginPath();
    ctx.ellipse(200, 450, 160, 100, 0, 0, Math.PI * 2);
    ctx.fill();

    // Collar
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(175, 360);
    ctx.lineTo(200, 410);
    ctx.lineTo(225, 360);
    ctx.closePath();
    ctx.fill();

    // Neck
    ctx.fillStyle = '#D4A373';
    ctx.fillRect(180, 290, 40, 70);

    // Head / Face
    ctx.fillStyle = '#E8B991';
    ctx.beginPath();
    ctx.ellipse(200, 220, 75, 95, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = '#2A211D';
    ctx.beginPath();
    ctx.ellipse(200, 160, 85, 60, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#1F2937';
    ctx.beginPath();
    ctx.ellipse(175, 215, 8, 5, 0, 0, Math.PI * 2);
    ctx.ellipse(225, 215, 8, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyebrows
    ctx.strokeStyle = '#2A211D';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(165, 202);
    ctx.quadraticCurveTo(175, 198, 187, 204);
    ctx.moveTo(213, 204);
    ctx.quadraticCurveTo(225, 198, 235, 202);
    ctx.stroke();

    // Nose
    ctx.strokeStyle = '#C48A5E';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(200, 215);
    ctx.lineTo(197, 240);
    ctx.lineTo(205, 240);
    ctx.stroke();

    // Mouth / Smile
    ctx.strokeStyle = '#A44A4A';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(200, 255, 16, 0.1 * Math.PI, 0.9 * Math.PI, false);
    ctx.stroke();

    // Ears
    ctx.fillStyle = '#D4A373';
    ctx.beginPath();
    ctx.ellipse(125, 225, 12, 22, 0, 0, Math.PI * 2);
    ctx.ellipse(275, 225, 12, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head and portrait completed without baked-in name/date strip
    // Dynamic Name & Date strip will be rendered cleanly by compressImage when enabled
  } else if (type === 'signature') {
    canvas.width = 400;
    canvas.height = 150;

    // Slight off-white paper texture with soft shadow
    ctx.fillStyle = '#FDFDFD';
    ctx.fillRect(0, 0, 400, 150);

    // Calligraphic flowing signature
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(50, 95);
    ctx.bezierCurveTo(80, 20, 90, 120, 130, 60);
    ctx.bezierCurveTo(160, 40, 170, 110, 200, 75);
    ctx.bezierCurveTo(230, 60, 250, 100, 280, 70);
    ctx.bezierCurveTo(310, 50, 320, 90, 350, 80);
    // Underline flourish
    ctx.moveTo(70, 115);
    ctx.quadraticCurveTo(200, 125, 330, 105);
    ctx.stroke();

    // Subtle guide line
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(30, 128);
    ctx.lineTo(370, 128);
    ctx.stroke();
  } else if (type === 'declaration') {
    // Handwritten Declaration Document (IBPS / SBI / National Exam Standard)
    canvas.width = 800;
    canvas.height = 400;

    // Pure white document paper with clean subtle border
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 800, 400);

    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(15, 15, 770, 370);

    // Subtle guide lines
    ctx.strokeStyle = '#F1F5F9';
    ctx.lineWidth = 1;
    for (let y = 75; y <= 310; y += 45) {
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.lineTo(770, y);
      ctx.stroke();
    }

    // Official handwritten declaration text (IBPS / SBI standard format)
    ctx.fillStyle = '#0F172A';
    ctx.font = 'italic 16px "Times New Roman", Times, serif';
    ctx.fillText('I hereby declare that all the information submitted by me in the application form', 40, 95);
    ctx.fillText('is correct, true and valid. I will present the supporting documents as and when', 40, 140);
    ctx.fillText('required by the recruitment board or conducting examination authority.', 40, 185);

    // Date & Place
    ctx.font = 'italic 14px "Times New Roman", Times, serif';
    ctx.fillStyle = '#334155';
    ctx.fillText(`Date: ${dateStr}`, 40, 260);
    ctx.fillText('Place: New Delhi', 40, 285);

    // Handwritten candidate signature
    ctx.font = 'italic bold 20px "Brush Script MT", cursive, Georgia, serif';
    ctx.fillStyle = '#1E3A8A';
    ctx.fillText(candidateName, 540, 260);
    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText('(Candidate Handwritten Signature)', 530, 285);
  } else {
    // Thumb Impression
    canvas.width = 300;
    canvas.height = 300;

    ctx.fillStyle = '#FAFAFA';
    ctx.fillRect(0, 0, 300, 300);

    // Blue stamp ink whorl pattern
    ctx.strokeStyle = '#1E3A8A';
    ctx.lineWidth = 2.2;

    const centerX = 150;
    const centerY = 150;

    for (let r = 12; r < 95; r += 7) {
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, r * 0.75, r, 0.1, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Outer thumb boundary
    ctx.fillStyle = 'rgba(30, 58, 138, 0.08)';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, 80, 105, 0.1, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas.toDataURL('image/jpeg', 0.92);
}

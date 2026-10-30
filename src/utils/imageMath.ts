/**
 * Pure mathematical, validation and parsing utilities for image compression
 * Decoupled from DOM/Canvas for instant unit testing.
 */

export interface DimensionCalcResult {
  width: number;
  height: number;
}

export interface DimensionLimits {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  exactWidth?: number;
  exactHeight?: number;
}

/**
 * Calculates output dimensions based on constraints and aspect ratio locking.
 * Supports minimum/maximum bounding dimensions.
 */
export function calculateTargetDimensions(
  origW: number,
  origH: number,
  requestedW?: number,
  requestedH?: number,
  lockAspect: boolean = true,
  minW?: number,
  minH?: number,
  maxW?: number,
  maxH?: number
): DimensionCalcResult {
  if (origW <= 0 || origH <= 0) {
    return { width: 300, height: 300 };
  }

  let finalW: number;
  let finalH: number;

  // If neither requested, use original dimensions
  if (!requestedW && !requestedH) {
    finalW = Math.round(origW);
    finalH = Math.round(origH);
  } else if (requestedW && requestedH && !lockAspect) {
    // If both requested and aspect ratio is not locked, return exact requested
    finalW = Math.round(requestedW);
    finalH = Math.round(requestedH);
  } else if (requestedW && requestedH && lockAspect) {
    // If both requested but aspect ratio IS locked, scale to fit within bounding box
    const scale = Math.min(requestedW / origW, requestedH / origH);
    finalW = Math.max(1, Math.round(origW * scale));
    finalH = Math.max(1, Math.round(origH * scale));
  } else if (requestedW && !requestedH) {
    const aspectRatio = origW / origH;
    finalW = Math.round(requestedW);
    finalH = Math.max(1, Math.round(requestedW / aspectRatio));
  } else if (!requestedW && requestedH) {
    const aspectRatio = origW / origH;
    finalW = Math.max(1, Math.round(requestedH * aspectRatio));
    finalH = Math.round(requestedH);
  } else {
    finalW = Math.round(origW);
    finalH = Math.round(origH);
  }

  // Ensure minimum dimensions if provided
  if (minW && finalW < minW) {
    if (lockAspect && origH > 0) {
      finalH = Math.round(finalH * (minW / finalW));
    }
    finalW = minW;
  }
  if (minH && finalH < minH) {
    if (lockAspect && origW > 0) {
      finalW = Math.round(finalW * (minH / finalH));
    }
    finalH = minH;
  }

  // Ensure maximum dimensions if provided
  if (maxW && finalW > maxW) {
    if (lockAspect && origH > 0) {
      finalH = Math.round(finalH * (maxW / finalW));
    }
    finalW = maxW;
  }
  if (maxH && finalH > maxH) {
    if (lockAspect && origW > 0) {
      finalW = Math.round(finalW * (maxH / finalH));
    }
    finalH = maxH;
  }

  return { width: finalW, height: finalH };
}

/**
 * Validates whether an image meets strict exam specifications for both KB and dimensions
 */
export function isWithinSpec(
  sizeKB: number,
  minKB: number,
  maxKB: number,
  width?: number,
  height?: number,
  reqWidth?: number,
  reqHeight?: number,
  limits?: DimensionLimits
): { passes: boolean; feedback: string } {
  const roundedKB = Math.round(sizeKB * 10) / 10;

  if (roundedKB < minKB) {
    return {
      passes: false,
      feedback: `File size is ${roundedKB} KB, which is smaller than required minimum ${minKB} KB.`,
    };
  }

  if (roundedKB > maxKB) {
    return {
      passes: false,
      feedback: `File size is ${roundedKB} KB, which exceeds allowed maximum ${maxKB} KB.`,
    };
  }

  // Check minimum dimensions
  if (limits?.minWidth && width && width < limits.minWidth) {
    return {
      passes: false,
      feedback: `Resolution width (${width}px) is below required minimum ${limits.minWidth}px.`,
    };
  }
  if (limits?.minHeight && height && height < limits.minHeight) {
    return {
      passes: false,
      feedback: `Resolution height (${height}px) is below required minimum ${limits.minHeight}px.`,
    };
  }

  // Check maximum dimensions
  if (limits?.maxWidth && width && width > limits.maxWidth) {
    return {
      passes: false,
      feedback: `Resolution width (${width}px) exceeds allowed maximum ${limits.maxWidth}px.`,
    };
  }
  if (limits?.maxHeight && height && height > limits.maxHeight) {
    return {
      passes: false,
      feedback: `Resolution height (${height}px) exceeds allowed maximum ${limits.maxHeight}px.`,
    };
  }

  // Check exact dimensions
  if (limits?.exactWidth && width && Math.abs(width - limits.exactWidth) > 10) {
    return {
      passes: false,
      feedback: `Width (${width}px) does not match prescribed ${limits.exactWidth}px.`,
    };
  }
  if (limits?.exactHeight && height && Math.abs(height - limits.exactHeight) > 10) {
    return {
      passes: false,
      feedback: `Height (${height}px) does not match prescribed ${limits.exactHeight}px.`,
    };
  }

  if (reqWidth && reqHeight && width && height) {
    const wDiff = Math.abs(width - reqWidth);
    const hDiff = Math.abs(height - reqHeight);
    if (wDiff > 10 || hDiff > 10) {
      return {
        passes: true,
        feedback: `Size (${roundedKB} KB) meets criteria [${minKB}-${maxKB} KB]. Resolution is ${width}x${height}px (Target was ${reqWidth}x${reqHeight}px).`,
      };
    }
  }

  return {
    passes: true,
    feedback: `Perfect! File size (${roundedKB} KB) meets strict portal requirements (${minKB} KB - ${maxKB} KB).`,
  };
}

/**
 * Format bytes to readable string (e.g. "34.5 KB", "1.2 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 KB';
  const kb = bytes / 1024;
  if (kb < 1000) {
    return `${kb.toFixed(1)} KB`;
  }
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

/**
 * Generate URL safe slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

/**
 * Replaces or injects JFIF APP0 marker density in JPEG binary buffer to set DPI
 */
export function setJpegDpiInBuffer(buffer: ArrayBuffer, dpi: number): ArrayBuffer {
  if (buffer.byteLength < 20) return buffer;
  const view = new DataView(buffer);
  // Check for JPEG SOI (0xFFD8)
  if (view.getUint16(0) !== 0xffd8) {
    return buffer;
  }

  let offset = 2;
  while (offset + 4 <= view.byteLength) {
    const marker = view.getUint16(offset);
    if (marker === 0xffe0) {
      // APP0 marker found!
      const length = view.getUint16(offset + 2);
      if (offset + 8 <= view.byteLength) {
        // Check for 'JFIF\0'
        const jfifTag =
          String.fromCharCode(view.getUint8(offset + 4)) +
          String.fromCharCode(view.getUint8(offset + 5)) +
          String.fromCharCode(view.getUint8(offset + 6)) +
          String.fromCharCode(view.getUint8(offset + 7));

        if (jfifTag === 'JFIF' && offset + 16 <= view.byteLength) {
          // Density units: 1 = dots per inch (DPI)
          view.setUint8(offset + 11, 1);
          // X density
          view.setUint16(offset + 12, dpi);
          // Y density
          view.setUint16(offset + 14, dpi);
          return buffer;
        }
      }
      offset += 2 + length;
    } else if ((marker & 0xff00) === 0xff00 && marker !== 0xffd8 && marker !== 0xffd9) {
      const length = view.getUint16(offset + 2);
      offset += 2 + length;
    } else {
      break;
    }
  }

  return buffer;
}

/**
 * Pads JPEG buffer with standard COM (0xFFFE) comment marker if size is below minBytes.
 * Preserves the APP0 (0xFFE0) JFIF marker immediately after SOI (0xFFD8) for strict
 * government portal compliance. Inserts COM immediately after APP0 (or right before EOI).
 * Uses a loop to insert multiple COM segments if padding exceeds maximum segment limit (65533 bytes).
 */
export function padJpegBufferToMinKB(buffer: ArrayBuffer, minBytes: number): ArrayBuffer {
  if (buffer.byteLength >= minBytes) {
    return buffer;
  }

  let currentBuffer = buffer;

  while (currentBuffer.byteLength < minBytes) {
    const bytesNeeded = minBytes - currentBuffer.byteLength;
    const view = new Uint8Array(currentBuffer);

    // Validate JPEG SOI (0xFFD8)
    if (view.length < 4 || view[0] !== 0xff || view[1] !== 0xd8) {
      return currentBuffer;
    }

    // Determine safe insertion point:
    // If APP0 (0xFFE0) is present at offset 2, insert immediately after APP0 segment.
    // Otherwise, insert right before EOI (0xFFD9) at the end of the stream.
    let insertPos = 2;
    if (view.length > 6 && view[2] === 0xff && view[3] === 0xe0) {
      const app0Length = (view[4] << 8) | view[5];
      insertPos = 4 + app0Length;
      if (insertPos > view.length - 2) {
        insertPos = Math.max(2, view.length - 2);
      }
    } else if (view.length >= 4 && view[view.length - 2] === 0xff && view[view.length - 1] === 0xd9) {
      insertPos = view.length - 2;
    }

    // Max payload length of a single JPEG segment is 65533 bytes (65535 minus 2 length bytes)
    const payloadLength = Math.min(65533, Math.max(1, bytesNeeded - 4));
    const segmentLength = payloadLength + 2;
    const commentHeader = new Uint8Array([0xff, 0xfe, (segmentLength >> 8) & 0xff, segmentLength & 0xff]);
    const padding = new Uint8Array(payloadLength);
    // Fill with whitespace padding
    padding.fill(0x20);

    const newBuffer = new Uint8Array(currentBuffer.byteLength + commentHeader.length + padding.length);
    newBuffer.set(view.subarray(0, insertPos), 0);
    newBuffer.set(commentHeader, insertPos);
    newBuffer.set(padding, insertPos + commentHeader.length);
    newBuffer.set(view.subarray(insertPos), insertPos + commentHeader.length + padding.length);

    currentBuffer = newBuffer.buffer;

    // Safety guard
    if (commentHeader.length + padding.length <= 4) {
      break;
    }
  }

  return currentBuffer;
}

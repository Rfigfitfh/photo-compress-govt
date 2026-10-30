import { DedicatedTool } from '../types';
import { EXAM_BODIES } from './examBodies';

// Helper to construct dedicated individual tools from exam bodies
function buildDedicatedTools(): DedicatedTool[] {
  const tools: DedicatedTool[] = [];

  EXAM_BODIES.forEach((exam) => {
    // 1. Dedicated Photo Tool
    tools.push({
      id: `${exam.id}-photo`,
      slug: `${exam.id}-photo-resize`,
      examId: exam.id,
      examName: exam.name,
      state: exam.state,
      toolType: 'photo',
      title: `${exam.name} Photo Resizer & Compressor (${exam.photo.minKB}-${exam.photo.maxKB} KB)`,
      shortTitle: `${exam.name} Photo Resizer`,
      badge: `${exam.photo.minKB}-${exam.photo.maxKB} KB`,
      spec: exam.photo,
      seoTitle: `${exam.name} Photo Resizer (${exam.photo.minKB}KB to ${exam.photo.maxKB}KB) - Exact Size`,
      seoDescription: `Resize and compress candidate photograph for ${exam.fullName} to exact ${exam.photo.minKB}-${exam.photo.maxKB} KB and ${exam.photo.dimensionLabel || 'official pixel size'}.`,
      seoKeywords: [
        `${exam.id} photo resize`,
        `${exam.name.toLowerCase()} photo compress in kb`,
        `${exam.state.toLowerCase()} exam photo resizer`,
        `${exam.photo.minKB} to ${exam.photo.maxKB} kb photo converter`,
      ],
      article: {
        heading: `Official Photo Requirements for ${exam.name}`,
        instructions: [
          `File size must strictly remain between ${exam.photo.minKB} KB and ${exam.photo.maxKB} KB.`,
          `Resolution: ${exam.photo.dimensionLabel || 'Prescribed aspect ratio 3.5cm x 4.5cm'}.`,
          `Format: JPG/JPEG format only.`,
          exam.photo.notes,
        ],
        portalWarning: `Ensure candidate face covers at least 70-80% of the photograph without caps, tinted glasses, or masks.`,
        specsTable: [
          { label: 'Exam Body', value: exam.fullName },
          { label: 'State / Region', value: exam.state },
          { label: 'Allowed File Size', value: `${exam.photo.minKB} KB - ${exam.photo.maxKB} KB` },
          { label: 'Recommended Resolution', value: exam.photo.dimensionLabel || '350 x 450 px' },
          { label: 'Background', value: exam.photo.backgroundRule || 'Plain white or light' },
          { label: 'Name & Date on Photo', value: exam.photo.requireNameDate ? 'Mandatory / Highly Recommended' : 'Optional' },
        ],
      },
    });

    // 2. Dedicated Signature Tool
    tools.push({
      id: `${exam.id}-signature`,
      slug: `${exam.id}-signature-resize`,
      examId: exam.id,
      examName: exam.name,
      state: exam.state,
      toolType: 'signature',
      title: `${exam.name} Signature Resizer & Ink Enhancer (${exam.signature.minKB}-${exam.signature.maxKB} KB)`,
      shortTitle: `${exam.name} Signature Resizer`,
      badge: `${exam.signature.minKB}-${exam.signature.maxKB} KB`,
      spec: exam.signature,
      seoTitle: `${exam.name} Signature Resizer (${exam.signature.minKB}KB to ${exam.signature.maxKB}KB) - Anti-Blur`,
      seoDescription: `Resize signature for ${exam.fullName} to ${exam.signature.minKB}-${exam.signature.maxKB} KB (${exam.signature.dimensionLabel || '140x60 px'}). Auto enhances ink clarity and removes paper shadows.`,
      seoKeywords: [
        `${exam.id} signature resize`,
        `${exam.name.toLowerCase()} signature 140x60`,
        `how to compress signature to ${exam.signature.maxKB} kb`,
        'clear signature for govt exam',
      ],
      article: {
        heading: `Signature Upload Instructions for ${exam.name}`,
        instructions: [
          `File size must be between ${exam.signature.minKB} KB and ${exam.signature.maxKB} KB.`,
          `Recommended dimensions: ${exam.signature.dimensionLabel || '140 x 60 pixels'}.`,
          `Sign strictly in running handwriting using black or dark blue ink pen on plain white paper.`,
          `Signatures in CAPITAL / BLOCK LETTERS will be rejected summarily by scrutiny software.`,
        ],
        portalWarning: `Our signature tool features automatic ink thresholding and contrast boosting so 140x60 signatures do not blur or become faint.`,
        specsTable: [
          { label: 'Exam Body', value: exam.fullName },
          { label: 'State / Region', value: exam.state },
          { label: 'Allowed File Size', value: `${exam.signature.minKB} KB - ${exam.signature.maxKB} KB` },
          { label: 'Dimensions', value: exam.signature.dimensionLabel || '140 x 60 px' },
          { label: 'Ink Color', value: 'Black or dark blue ink' },
          { label: 'Anti-Blur Processing', value: 'Enhanced Ink Dilation Active' },
        ],
      },
    });

    // 3. Dedicated Thumb Impression Tool (if exam requires it)
    if (exam.thumb) {
      tools.push({
        id: `${exam.id}-thumb`,
        slug: `${exam.id}-thumb-impression-resize`,
        examId: exam.id,
        examName: exam.name,
        state: exam.state,
        toolType: 'thumb',
        title: `${exam.name} Left Thumb Impression Resizer (${exam.thumb.minKB}-${exam.thumb.maxKB} KB)`,
        shortTitle: `${exam.name} Thumb Resizer`,
        badge: `${exam.thumb.minKB}-${exam.thumb.maxKB} KB`,
        spec: exam.thumb,
        seoTitle: `${exam.name} Left Thumb Impression (LTI) Resizer (${exam.thumb.minKB}-${exam.thumb.maxKB} KB)`,
        seoDescription: `Crop, clean and resize Left Thumb Impression for ${exam.fullName} to ${exam.thumb.minKB}-${exam.thumb.maxKB} KB at 200 DPI. Sharp ridge line enhancement.`,
        seoKeywords: [
          `${exam.id} thumb impression resize`,
          `${exam.name.toLowerCase()} lti size in kb`,
          'thumb impression 240x240 px 200 dpi',
          'clear fingerprint image for bank exam',
        ],
        article: {
          heading: `Left Thumb Impression Guidelines for ${exam.name}`,
          instructions: [
            `File size must strictly range between ${exam.thumb.minKB} KB and ${exam.thumb.maxKB} KB.`,
            `Dimensions: ${exam.thumb.dimensionLabel || '240 x 240 pixels (3cm x 3cm)'}.`,
            `Use a blue or black stamp pad on a clean sheet of white paper.`,
            `Ensure fingerprint ridge lines are sharp and not smudged or doubly imprinted.`,
          ],
          portalWarning: `Smudged thumb impressions lead to biometric mismatches on exam day. Use our Thumb Ridge Sharpening filter.`,
          specsTable: [
            { label: 'Exam Agency', value: exam.fullName },
            { label: 'Permitted Size', value: `${exam.thumb.minKB} KB - ${exam.thumb.maxKB} KB` },
            { label: 'Dimensions', value: exam.thumb.dimensionLabel || '240 x 240 px (3x3 cm)' },
            { label: 'Resolution', value: '200 DPI' },
            { label: 'Biometric Hand', value: 'Left Hand Thumb (LTI)' },
          ],
        },
      });
    }

    // 4. Dedicated Declaration Tool (if exam requires it)
    if (exam.declaration) {
      tools.push({
        id: `${exam.id}-declaration`,
        slug: `${exam.id}-handwritten-declaration-resize`,
        examId: exam.id,
        examName: exam.name,
        state: exam.state,
        toolType: 'declaration',
        title: `${exam.name} Handwritten Declaration Resizer (${exam.declaration.minKB}-${exam.declaration.maxKB} KB)`,
        shortTitle: `${exam.name} Declaration Resizer`,
        badge: `${exam.declaration.minKB}-${exam.declaration.maxKB} KB`,
        spec: exam.declaration,
        seoTitle: `${exam.name} Handwritten Declaration Resizer (${exam.declaration.minKB}-${exam.declaration.maxKB} KB)`,
        seoDescription: `Resize handwritten declaration for ${exam.fullName} to exact ${exam.declaration.minKB}-${exam.declaration.maxKB} KB (${exam.declaration.dimensionLabel || '800x400 px'}).`,
        seoKeywords: [
          `${exam.id} handwritten declaration resize`,
          `${exam.name.toLowerCase()} declaration size 50 to 100 kb`,
          'hand written declaration bank exam',
        ],
        article: {
          heading: `Handwritten Declaration Instructions for ${exam.name}`,
          instructions: [
            `File size must be between ${exam.declaration.minKB} KB and ${exam.declaration.maxKB} KB.`,
            `Dimensions: ${exam.declaration.dimensionLabel || '800 x 400 pixels (10cm x 5cm)'}.`,
            `Declaration must be handwritten in English only in candidate own handwriting.`,
            `Do NOT write the declaration in CAPITAL letters; it will be rejected.`,
          ],
          portalWarning: `Declarations typed or signed by another individual will result in permanent debarment.`,
          specsTable: [
            { label: 'Exam Body', value: exam.fullName },
            { label: 'Allowed File Size', value: `${exam.declaration.minKB} KB - ${exam.declaration.maxKB} KB` },
            { label: 'Dimensions', value: exam.declaration.dimensionLabel || '800 x 400 px' },
            { label: 'Language', value: 'English only (Running hand)' },
          ],
        },
      });
    }
  });

  return tools;
}

export const DEDICATED_TOOLS: DedicatedTool[] = buildDedicatedTools();

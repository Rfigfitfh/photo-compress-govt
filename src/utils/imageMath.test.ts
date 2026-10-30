import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTargetDimensions,
  isWithinSpec,
  formatFileSize,
  slugify,
  setJpegDpiInBuffer,
  padJpegBufferToMinKB,
} from './imageMath';

test('calculateTargetDimensions scales while preserving aspect ratio', () => {
  // Original 1000x1000 (1:1), requested 200x230 with lockAspect=true
  const res = calculateTargetDimensions(1000, 1000, 200, 230, true);
  assert.equal(res.width, 200);
  assert.equal(res.height, 200);
});

test('calculateTargetDimensions handles exact dimension override when lockAspect=false', () => {
  const res = calculateTargetDimensions(1000, 1000, 200, 230, false);
  assert.equal(res.width, 200);
  assert.equal(res.height, 230);
});

test('calculateTargetDimensions handles single dimension constraint', () => {
  const resW = calculateTargetDimensions(800, 400, 400, undefined, true);
  assert.equal(resW.width, 400);
  assert.equal(resW.height, 200);

  const resH = calculateTargetDimensions(800, 400, undefined, 100, true);
  assert.equal(resH.width, 200);
  assert.equal(resH.height, 100);
});

test('isWithinSpec validates minimum and maximum KB thresholds', () => {
  // Test inside range
  const pass = isWithinSpec(35, 20, 50);
  assert.equal(pass.passes, true);

  // Test below minimum
  const failLow = isWithinSpec(15, 20, 50);
  assert.equal(failLow.passes, false);
  assert.match(failLow.feedback, /smaller than required minimum/);

  // Test above maximum
  const failHigh = isWithinSpec(65, 20, 50);
  assert.equal(failHigh.passes, false);
  assert.match(failHigh.feedback, /exceeds allowed maximum/);
});

test('formatFileSize formats bytes correctly', () => {
  assert.equal(formatFileSize(0), '0 KB');
  assert.equal(formatFileSize(1024 * 35.4), '35.4 KB');
  assert.equal(formatFileSize(1024 * 1024 * 2.5), '2.50 MB');
});

test('slugify cleans names into clean URLs', () => {
  assert.equal(slugify('UPSC Civil Services 2026'), 'upsc-civil-services-2026');
  assert.equal(slugify('SSC CGL & CHSL Photo (20-50KB)'), 'ssc-cgl-chsl-photo-20-50kb');
});

test('setJpegDpiInBuffer handles buffer without throwing', () => {
  const buf = new Uint8Array([
    0xff, 0xd8, // SOI
    0xff, 0xe0, // APP0
    0x00, 0x10, // length = 16
    0x4a, 0x46, 0x49, 0x46, 0x00, // JFIF\0
    0x01, 0x02, // version 1.02
    0x00, // units (0 = none)
    0x00, 0x48, // Xdensity 72
    0x00, 0x48, // Ydensity 72
    0x00, 0x00, // thumbnail
  ]).buffer;

  const modified = setJpegDpiInBuffer(buf, 200);
  const view = new DataView(modified);
  assert.equal(view.getUint8(13), 1); // units = 1 (dots per inch)
  assert.equal(view.getUint16(14), 200); // Xdensity = 200
  assert.equal(view.getUint16(16), 200); // Ydensity = 200
});

test('padJpegBufferToMinKB pads tiny JPEG buffer to meet min KB limit without corrupting header', () => {
  const buf = new Uint8Array([
    0xff, 0xd8, // SOI
    0xff, 0xe0, // APP0
    0x00, 0x10,
    0x4a, 0x46, 0x49, 0x46, 0x00,
    0x01, 0x02, 0x00, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00,
    0xff, 0xd9 // EOI
  ]).buffer;

  // Tiny buffer is only 20 bytes (~0.02 KB), pad to 10240 bytes (10 KB)
  const padded = padJpegBufferToMinKB(buf, 10240);
  assert.ok(padded.byteLength >= 10240);

  const view = new Uint8Array(padded);
  assert.equal(view[0], 0xff);
  assert.equal(view[1], 0xd8); // Still valid JPEG SOI
  assert.equal(view[2], 0xff);
  assert.equal(view[3], 0xe0); // APP0 marker preserved directly after SOI!
  // COM marker inserted right after APP0 segment (offset 20)
  assert.equal(view[20], 0xff);
  assert.equal(view[21], 0xfe);
});

test('exam bodies data has accurate dimensions for RRB and GATE', async () => {
  const { EXAM_BODIES } = await import('../data/examBodies');
  const rrb = EXAM_BODIES.find((e) => e.id === 'rrb');
  assert.ok(rrb);
  // RRB photo must be portrait: 240 width x 320 height
  assert.equal(rrb.photo.exactWidth, 240);
  assert.equal(rrb.photo.exactHeight, 320);

  const gate = EXAM_BODIES.find((e) => e.id === 'gate');
  assert.ok(gate);
  // GATE signature must be landscape: 560 width x 160 height
  assert.equal(gate.signature.exactWidth, 560);
  assert.equal(gate.signature.exactHeight, 160);
});

test('tokenized search matches all quick-search query phrases', async () => {
  const { EXAM_BODIES } = await import('../data/examBodies');
  const quickSearches = [
    'UPSC Civil Services',
    'SSC CGL & CHSL',
    'IBPS PO & Clerk',
    'NEET UG 2026',
    'UP Police',
    'BPSC Bihar',
    'RPSC Rajasthan',
  ];

  for (const query of quickSearches) {
    const tokens = query
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter((t) => t.length > 0 && t !== '&');

    const matches = EXAM_BODIES.filter((e) => {
      const hay = `${e.name} ${e.fullName} ${e.state} ${e.category} ${e.seoKeywords.join(' ')}`.toLowerCase();
      return tokens.every((token) => hay.includes(token));
    });

    assert.ok(matches.length > 0, `Query "${query}" must return at least 1 matching exam body`);
  }
});

test('padJpegBufferToMinKB handles large padding (>65533 bytes) across multiple COM segments', () => {
  const buf = new Uint8Array([
    0xff, 0xd8, // SOI
    0xff, 0xe0, // APP0
    0x00, 0x10,
    0x4a, 0x46, 0x49, 0x46, 0x00,
    0x01, 0x02, 0x00, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00,
    0xff, 0xd9 // EOI
  ]).buffer;

  // Request 75,000 bytes padding (exceeds single JPEG segment maximum of 65,533 payload bytes)
  const padded = padJpegBufferToMinKB(buf, 75000);
  assert.ok(padded.byteLength >= 75000);

  const view = new Uint8Array(padded);
  assert.equal(view[0], 0xff);
  assert.equal(view[1], 0xd8); // Valid SOI
  assert.equal(view[2], 0xff);
  assert.equal(view[3], 0xe0); // APP0 intact at offset 2
});

test('isWithinSpec enforces dimensionLimits for minimum and maximum pixel boundaries', () => {
  // Candidate image is 300x120px, but UPSC OTR requires minimum 350x350px
  const upscFail = isWithinSpec(30, 20, 50, 300, 120, undefined, undefined, {
    minWidth: 350,
    minHeight: 350,
  });
  assert.equal(upscFail.passes, false);
  assert.match(upscFail.feedback, /below required minimum/);

  // Candidate image is 400x400px (satisfies min 350x350px)
  const upscPass = isWithinSpec(30, 20, 50, 400, 400, undefined, undefined, {
    minWidth: 350,
    minHeight: 350,
  });
  assert.equal(upscPass.passes, true);
});

test('calculateTargetDimensions enforces minimum bounding dimensions', () => {
  // If minW is 480 and minH is 640 (GATE photo requirement), output respects minimum
  const res = calculateTargetDimensions(350, 450, 350, 450, true, 480, 640);
  assert.ok(res.width >= 480);
  assert.ok(res.height >= 640);
});

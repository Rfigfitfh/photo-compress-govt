import test from 'node:test';
import assert from 'node:assert/strict';
import { generateXmlSitemap, getAllSitemapEntries } from './sitemapGenerator';

test('getAllSitemapEntries returns comprehensive list of indexed URLs', () => {
  const entries = getAllSitemapEntries();
  assert.ok(entries.length > 30, `Expected > 30 sitemap entries, got ${entries.length}`);

  // Must contain canonical domain
  const home = entries.find((e) => e.loc === 'https://image-compress.cloud');
  assert.ok(home, 'Home page must be in sitemap');
  assert.equal(home.priority, '1.0');

  // Must contain SSC signature dedicated tool
  const sscSig = entries.find((e) => e.loc.includes('ssc-signature-resize'));
  assert.ok(sscSig, 'SSC signature dedicated tool must be in sitemap');

  // Must contain legal pages
  const privacy = entries.find((e) => e.loc === 'https://image-compress.cloud/privacy-policy');
  assert.ok(privacy, 'Privacy policy must be in sitemap');
});

test('generateXmlSitemap produces valid XML sitemap structure', () => {
  const xml = generateXmlSitemap();
  assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'));
  assert.ok(xml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'));
  assert.ok(xml.includes('<loc>https://image-compress.cloud</loc>'));
  assert.ok(xml.includes('</urlset>'));
});

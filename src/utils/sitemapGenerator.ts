import { DEDICATED_TOOLS } from '../data/dedicatedTools';
import { EXAM_BODIES, BLOG_POSTS } from '../data/examBodies';

const BASE_URL = 'https://image-compress.cloud';
const CURRENT_DATE = '2026-10-29';

export interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: string;
  title: string;
  category: string;
}

export function getAllSitemapEntries(): SitemapEntry[] {
  const entries: SitemapEntry[] = [
    {
      loc: `${BASE_URL}`,
      lastmod: CURRENT_DATE,
      changefreq: 'daily',
      priority: '1.0',
      title: 'Home - Indian Exam Photo & Signature Resizer',
      category: 'Main',
    },
    {
      loc: `${BASE_URL}/tools/photo-compressor`,
      lastmod: CURRENT_DATE,
      changefreq: 'weekly',
      priority: '0.9',
      title: 'Universal Photo Resizer in KB & Pixels',
      category: 'Universal Tools',
    },
    {
      loc: `${BASE_URL}/tools/signature-resize`,
      lastmod: CURRENT_DATE,
      changefreq: 'weekly',
      priority: '0.9',
      title: 'Signature Resizer (10KB - 20KB) & Ink Enhancer',
      category: 'Universal Tools',
    },
    {
      loc: `${BASE_URL}/tools/thumb-impression`,
      lastmod: CURRENT_DATE,
      changefreq: 'weekly',
      priority: '0.9',
      title: 'Left Thumb Impression (20KB - 50KB) Resizer',
      category: 'Universal Tools',
    },
    {
      loc: `${BASE_URL}/tools/name-date-on-photo`,
      lastmod: CURRENT_DATE,
      changefreq: 'weekly',
      priority: '0.9',
      title: 'Add Name & Date of Photo (DOP) Stamp Tool',
      category: 'Universal Tools',
    },
  ];

  // Dedicated Tools (Each exam body's separate photo, signature, thumb tools)
  DEDICATED_TOOLS.forEach((tool) => {
    entries.push({
      loc: `${BASE_URL}/tool/${tool.slug}`,
      lastmod: CURRENT_DATE,
      changefreq: 'weekly',
      priority: '0.8',
      title: tool.title,
      category: `${tool.state} Tools`,
    });
  });

  // Dedicated Exam Directory Pages
  EXAM_BODIES.forEach((exam) => {
    entries.push({
      loc: `${BASE_URL}/exam/${exam.slug}`,
      lastmod: CURRENT_DATE,
      changefreq: 'weekly',
      priority: '0.8',
      title: `${exam.name} All Tools & Guidelines`,
      category: 'Exam Hubs',
    });
  });

  // Blog Guides
  entries.push({
    loc: `${BASE_URL}/blog`,
    lastmod: CURRENT_DATE,
    changefreq: 'daily',
    priority: '0.7',
    title: 'Exam Photo & Signature Rules Blog',
    category: 'Blog',
  });

  BLOG_POSTS.forEach((post) => {
    entries.push({
      loc: `${BASE_URL}/blog/${post.slug}`,
      lastmod: CURRENT_DATE,
      changefreq: 'monthly',
      priority: '0.7',
      title: post.title,
      category: 'Blog Articles',
    });
  });

  // Legal & AdSense Pages
  [
    { path: '/about', title: 'About Us', priority: '0.5' },
    { path: '/privacy-policy', title: 'Privacy Policy', priority: '0.5' },
    { path: '/terms-of-service', title: 'Terms & Conditions', priority: '0.5' },
    { path: '/contact', title: 'Contact Us', priority: '0.5' },
    { path: '/disclaimer', title: 'Government Examination Disclaimer', priority: '0.5' },
    { path: '/cookie-policy', title: 'Cookie Policy', priority: '0.5' },
    { path: '/sitemap', title: 'HTML & XML Sitemap Index', priority: '0.5' },
  ].forEach((p) => {
    entries.push({
      loc: `${BASE_URL}${p.path}`,
      lastmod: CURRENT_DATE,
      changefreq: 'monthly',
      priority: p.priority,
      title: p.title,
      category: 'Legal & AdSense',
    });
  });

  return entries;
}

/**
 * Generates official XML format string conforming to Sitemaps.org protocol 0.9
 */
export function generateXmlSitemap(): string {
  const entries = getAllSitemapEntries();
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  entries.forEach((e) => {
    xml += `  <url>\n`;
    xml += `    <loc>${e.loc}</loc>\n`;
    xml += `    <lastmod>${e.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${e.changefreq}</changefreq>\n`;
    xml += `    <priority>${e.priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;
  return xml;
}

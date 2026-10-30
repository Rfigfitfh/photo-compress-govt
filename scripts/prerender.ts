import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getAllSitemapEntries, generateXmlSitemap } from '../src/utils/sitemapGenerator';
import { DEDICATED_TOOLS } from '../src/data/dedicatedTools';
import { EXAM_BODIES, BLOG_POSTS } from '../src/data/examBodies';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist');
const BASE_URL = 'https://image-compress.cloud';

interface PageMetadata {
  title: string;
  description: string;
  canonical: string;
  keywords?: string | string[];
  structuredData?: any;
  bodyHtml: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getPageMetadata(routePath: string): PageMetadata {
  // Normalize
  const p = routePath === '' || routePath === '/' ? '/' : routePath.replace(/\/$/, '');
  const canonical = `${BASE_URL}${p === '/' ? '' : p}`;

  // 1. Root / Home
  if (p === '/') {
    return {
      title: 'Image Compress Cloud - Indian Exam Photo & Signature Resizer (Exact KB)',
      description: 'Fast photo, signature, and thumb impression compressor & resizer for Indian government exams (UPSC, SSC, IBPS, NTA, State PSCs) to exact KB and pixel specifications.',
      canonical,
      keywords: 'photo compressor, signature resizer, 20kb to 50kb photo, 10kb to 20kb signature, upsc photo resizer, ssc photo resize, admit card photo compressor',
      structuredData: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            name: 'Image Compress Cloud',
            url: BASE_URL,
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: 'All',
            description: 'Free online client-side photo, signature, and thumb impression compressor and resizer tailored for all Indian competitive exams.',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'INR',
            },
          },
          {
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Why do Indian exam portals reject candidate photos and signatures?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Online portals use automated server filters that enforce strict byte size ranges (e.g. 20 KB to 50 KB) and aspect ratios. If an image is 19.8 KB or 50.2 KB, the server rejects it. Image Compress Cloud guarantees your file falls squarely within official limits.',
                },
              },
              {
                '@type': 'Question',
                name: 'Is it safe to upload my photo, signature, and thumb impression here?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes, 100%. All compression and resizing occurs in your browser RAM using HTML5 Canvas and Pica.js. No photos, signatures, or documents are ever uploaded to any server or stored.',
                },
              },
            ],
          },
        ],
      },
      bodyHtml: `
        <header style="padding: 1.5rem; border-bottom: 1px solid #E5DFD3;">
          <nav>
            <a href="/"><strong>Image Compress Cloud</strong></a> |
            <a href="/tools/photo-compressor">Photo Resizer</a> |
            <a href="/tools/signature-resize">Signature Resizer</a> |
            <a href="/tools/thumb-impression">Thumb Impression</a> |
            <a href="/tools/name-date-on-photo">Name & Date Tool</a> |
            <a href="/blog">Exam Guides</a>
          </nav>
        </header>
        <main style="max-width: 1000px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
          <h1>Indian Exam Photo &amp; Signature Resizer (Exact KB)</h1>
          <p>Instantly compress and resize photographs, signatures, and thumb impressions for UPSC, SSC, IBPS, Railways, Defence, and State PSCs (Odisha, UP, Bihar, Maharashtra, Rajasthan, MP, West Bengal) to exact KB and pixel limits in under 0.5 seconds.</p>
          <section>
            <h2>Popular Examination Resizers</h2>
            <ul>
              ${EXAM_BODIES.map(
                (e) => `<li><a href="/exam/${e.slug}"><strong>${escapeHtml(e.name)}</strong> Photo &amp; Signature Resizer (${escapeHtml(e.state)})</a> - ${escapeHtml(e.fullName)}</li>`
              ).join('')}
            </ul>
          </section>
        </main>
      `,
    };
  }

  // 2. Dedicated Tool Page: /tool/:slug
  if (p.startsWith('/tool/')) {
    const slug = p.replace('/tool/', '');
    const tool = DEDICATED_TOOLS.find((t) => t.slug === slug);
    if (tool) {
      const parentExam = EXAM_BODIES.find((e) => e.id === tool.examId);
      const examHubPath = parentExam ? `/exam/${parentExam.slug}` : `/exam/${tool.examId}`;

      return {
        title: tool.seoTitle,
        description: tool.seoDescription,
        canonical,
        keywords: tool.seoKeywords,
        structuredData: {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebApplication',
              name: tool.title,
              description: tool.seoDescription,
              url: canonical,
              applicationCategory: 'UtilitiesApplication',
              operatingSystem: 'All',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'INR',
              },
            },
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'All Exams Directory', item: BASE_URL },
                { '@type': 'ListItem', position: 2, name: tool.examName, item: `${BASE_URL}${examHubPath}` },
                { '@type': 'ListItem', position: 3, name: tool.shortTitle, item: canonical },
              ],
            },
          ],
        },
        bodyHtml: `
          <main style="max-width: 900px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
            <nav aria-label="Breadcrumb">
              <a href="/">Home</a> / <a href="${examHubPath}">${escapeHtml(tool.examName)}</a> / <span>${escapeHtml(tool.shortTitle)}</span>
            </nav>
            <h1>${escapeHtml(tool.title)}</h1>
            <p><strong>State:</strong> ${escapeHtml(tool.state)} | <strong>Target Size:</strong> ${escapeHtml(tool.badge)} (${tool.spec.minKB} KB - ${tool.spec.maxKB} KB)</p>
            <article>
              <h2>${escapeHtml(tool.article.heading)}</h2>
              <div style="background: #F4EFE6; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                <h3>Official Upload Guidelines:</h3>
                <ul>
                  ${tool.article.instructions.map((i) => `<li>${escapeHtml(i)}</li>`).join('')}
                </ul>
              </div>
              <p><strong>Portal Warning:</strong> ${escapeHtml(tool.article.portalWarning)}</p>
              <h3>Specifications Sheet</h3>
              <table border="1" cellpadding="6" style="border-collapse: collapse; width: 100%; margin-top: 1rem;">
                ${tool.article.specsTable.map((row) => `<tr><td><strong>${escapeHtml(row.label)}</strong></td><td>${escapeHtml(row.value)}</td></tr>`).join('')}
              </table>
            </article>
          </main>
        `,
      };
    }
  }

  // 3. Exam Directory Page: /exam/:slug
  if (p.startsWith('/exam/')) {
    const slug = p.replace('/exam/', '');
    const exam = EXAM_BODIES.find((e) => e.slug === slug);
    if (exam) {
      return {
        title: exam.seoTitle,
        description: exam.seoDescription,
        canonical,
        keywords: exam.seoKeywords,
        structuredData: {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebApplication',
              name: `${exam.name} Photo & Signature Resizer`,
              description: exam.seoDescription,
              url: canonical,
              applicationCategory: 'UtilitiesApplication',
              operatingSystem: 'All',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'INR',
              },
            },
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'All Exams Directory', item: BASE_URL },
                { '@type': 'ListItem', position: 2, name: exam.name, item: canonical },
              ],
            },
            {
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: `What are the exact photo specifications for ${exam.name}?`,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: `Candidate photographs must be in JPEG/JPG format, strictly between ${exam.photo.minKB} KB and ${exam.photo.maxKB} KB.`,
                  },
                },
                {
                  '@type': 'Question',
                  name: `What is the signature file size limit for ${exam.name}?`,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: `Signatures for ${exam.name} must be within ${exam.signature.minKB} KB to ${exam.signature.maxKB} KB in JPG/JPEG format.`,
                  },
                },
              ],
            },
          ],
        },
        bodyHtml: `
          <main style="max-width: 900px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
            <nav aria-label="Breadcrumb">
              <a href="/">Home</a> / <span>${escapeHtml(exam.state)}</span> / <span>${escapeHtml(exam.name)}</span>
            </nav>
            <h1>${escapeHtml(exam.name)} Photo &amp; Signature Resizer</h1>
            <p><strong>Full Name:</strong> ${escapeHtml(exam.fullName)} | <strong>State:</strong> ${escapeHtml(exam.state)}</p>
            <p><strong>Photo Range:</strong> ${exam.photo.minKB} KB - ${exam.photo.maxKB} KB | <strong>Signature Range:</strong> ${exam.signature.minKB} KB - ${exam.signature.maxKB} KB</p>
            <article>
              <h2>Official Guidelines for ${escapeHtml(exam.name)} Upload</h2>
              <p>${escapeHtml(exam.articleContent.intro)}</p>
              <h3>Checklist:</h3>
              <ul>
                ${exam.articleContent.rules.map((r) => `<li>${escapeHtml(r)}</li>`).join('')}
              </ul>
              <p>${escapeHtml(exam.articleContent.dimensionsGuide)}</p>
            </article>
          </main>
        `,
      };
    }
  }

  // 4. Universal Tools
  const universalToolsMap: Record<string, { title: string; desc: string; h1: string }> = {
    '/tools/photo-compressor': {
      title: 'Online Exam Photo Resizer & Compressor in KB (20KB - 50KB) - Image Compress Cloud',
      desc: 'Free online photo resizer and compressor in exact KB (10KB, 20KB, 50KB, 100KB) and pixels for UPSC, SSC, IBPS, NEET, and State PSC exams.',
      h1: 'Online Exam Photo Resizer & Compressor in KB (20KB - 50KB)',
    },
    '/tools/signature-resize': {
      title: 'Online Signature Resizer & Enhancer (10KB - 20KB) - Image Compress Cloud',
      desc: 'Resize signature to 10KB - 20KB, remove grey paper background, and darken blue/black ink for SSC, IBPS, UPSC, and State exams.',
      h1: 'Online Signature Resizer & Enhancer (10KB - 20KB)',
    },
    '/tools/thumb-impression': {
      title: 'Left Thumb Impression Resizer & Cleaner (20KB - 50KB) - Image Compress Cloud',
      desc: 'Resize left thumb impression (LTI) to 20KB - 50KB and 240x240 pixels at 200 DPI for IBPS, SBI, NTA, and police recruitment.',
      h1: 'Left Thumb Impression Resizer & Cleaner (20KB - 50KB)',
    },
    '/tools/name-date-on-photo': {
      title: 'Add Name & Date of Photo (DOP) on Passport Photo Tool - Image Compress Cloud',
      desc: 'Print candidate name and date of photo (DOP) on a clean white bottom strip for SSC, UPPSC, TNPSC, and Kerala PSC online applications.',
      h1: 'Add Name & Date of Photo (DOP) on Passport Photo',
    },
  };

  if (universalToolsMap[p]) {
    const item = universalToolsMap[p];
    return {
      title: item.title,
      description: item.desc,
      canonical,
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: item.h1,
        description: item.desc,
        url: canonical,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
      },
      bodyHtml: `
        <main style="max-width: 900px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
          <nav><a href="/">Home</a> / <span>${escapeHtml(item.h1)}</span></nav>
          <h1>${escapeHtml(item.h1)}</h1>
          <p>${escapeHtml(item.desc)}</p>
        </main>
      `,
    };
  }

  // 5. Blog
  if (p === '/blog') {
    return {
      title: 'Indian Exam Photo & Signature Rules Blog 2026 - Image Compress Cloud',
      description: 'Read detailed guides on UPSC, SSC, IBPS, and State PSC photo, signature, and thumb impression requirements to avoid application form rejection.',
      canonical,
      bodyHtml: `
        <main style="max-width: 900px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
          <h1>Indian Exam Photo &amp; Signature Rules Blog</h1>
          <p>Official notification rules and technical guides for Indian competitive exam documents.</p>
          <ul>
            ${BLOG_POSTS.map((bp) => `<li><a href="/blog/${bp.slug}"><strong>${escapeHtml(bp.title)}</strong></a> - ${escapeHtml(bp.description)}</li>`).join('')}
          </ul>
        </main>
      `,
    };
  }

  if (p.startsWith('/blog/')) {
    const slug = p.replace('/blog/', '');
    const post = BLOG_POSTS.find((bp) => bp.slug === slug);
    if (post) {
      return {
        title: `${post.title} | Exam Guides`,
        description: post.description,
        canonical,
        structuredData: {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Article',
              headline: post.title,
              description: post.description,
              image: [`${BASE_URL}/og-banner.png`],
              datePublished: '2026-10-29T10:00:00+05:30',
              dateModified: '2026-10-30T05:30:00+05:30',
              author: { '@type': 'Person', name: 'Sumit Dal', url: `${BASE_URL}/about` },
              publisher: {
                '@type': 'Organization',
                name: 'Image Compress Cloud',
                url: BASE_URL,
                logo: { '@type': 'ImageObject', url: `${BASE_URL}/og-banner.png` },
              },
            },
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
                { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` },
                { '@type': 'ListItem', position: 3, name: post.title, item: canonical },
              ],
            },
          ],
        },
        bodyHtml: `
          <main style="max-width: 900px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
            <nav><a href="/">Home</a> / <a href="/blog">Blog</a> / <span>${escapeHtml(post.title)}</span></nav>
            <article>
              <h1>${escapeHtml(post.title)}</h1>
              <p><em>Published: ${escapeHtml(post.date)} | Category: ${escapeHtml(post.category)}</em></p>
              <p>${escapeHtml(post.description)}</p>
              <div>${escapeHtml(post.content).replace(/\\n/g, '<br/>')}</div>
            </article>
          </main>
        `,
      };
    }
  }

  // 6. Legal Pages
  const legalPagesMap: Record<string, { title: string; desc: string; h1: string }> = {
    '/about': {
      title: 'About Us - Image Compress Cloud',
      desc: 'Learn about Image Compress Cloud, developed by Sumit Dal in Odisha, India, to provide free, private, client-side photo and signature resizing for job applicants.',
      h1: 'About Image Compress Cloud',
    },
    '/privacy-policy': {
      title: 'Privacy Policy - 100% Client-Side In-Memory Processing - Image Compress Cloud',
      desc: 'Privacy Policy for Image Compress Cloud. 100% client-side in-memory document processing. No photographs or signatures are ever uploaded or stored.',
      h1: 'Privacy Policy',
    },
    '/terms-of-service': {
      title: 'Terms of Service - Image Compress Cloud',
      desc: 'Terms of Service for using Image Compress Cloud tools and examination document preparation utilities.',
      h1: 'Terms of Service',
    },
    '/contact': {
      title: 'Contact Us - Image Compress Cloud Support',
      desc: 'Get in touch with Sumit Dal at Image Compress Cloud in Odisha, India. Email: sumitdal125@gmail.com, Mobile: 7789090050.',
      h1: 'Contact Us',
    },
    '/disclaimer': {
      title: 'Government Examination Disclaimer - Image Compress Cloud',
      desc: 'Official non-affiliation disclaimer: Image Compress Cloud is an independent utility and is not affiliated with any government recruitment board.',
      h1: 'Disclaimer',
    },
    '/cookie-policy': {
      title: 'Cookie Policy - Image Compress Cloud',
      desc: 'Learn about cookies and local storage usage on Image Compress Cloud.',
      h1: 'Cookie Policy',
    },
    '/sitemap': {
      title: 'HTML Sitemap & Exam Directory - Image Compress Cloud',
      desc: 'Complete crawlable directory of all Indian central and state examination photo resizer tools, signature utilities, and guides.',
      h1: 'Complete Exam Tools Sitemap',
    },
  };

  if (legalPagesMap[p]) {
    const item = legalPagesMap[p];
    return {
      title: item.title,
      description: item.desc,
      canonical,
      bodyHtml: `
        <main style="max-width: 900px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
          <nav><a href="/">Home</a> / <span>${escapeHtml(item.h1)}</span></nav>
          <h1>${escapeHtml(item.h1)}</h1>
          <p>${escapeHtml(item.desc)}</p>
          <p><strong>Contact:</strong> Sumit Dal, Odisha, India | Email: sumitdal125@gmail.com | Phone: +91 7789090050</p>
        </main>
      `,
    };
  }

  // Fallback
  return {
    title: 'Image Compress Cloud - Indian Exam Photo & Signature Resizer',
    description: 'Compress and resize photos and signatures for Indian competitive examinations.',
    canonical,
    bodyHtml: `<h1>Image Compress Cloud</h1><p><a href="/">Return to Home</a></p>`,
  };
}

function prerender() {
  console.log('Starting static pre-rendering (SSG)...');

  const templatePath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(templatePath)) {
    console.error(`Error: ${templatePath} not found! Run "vite build" first.`);
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(templatePath, 'utf-8');
  const entries = getAllSitemapEntries();
  console.log(`Generating static pages for ${entries.length} sitemap routes...`);

  let count = 0;
  for (const entry of entries) {
    const routeUrl = new URL(entry.loc);
    const routePath = routeUrl.pathname;
    const meta = getPageMetadata(routePath);

    // Replace <title>
    let html = baseHtml.replace(
      /<title>[\s\S]*?<\/title>/i,
      `<title>${escapeHtml(meta.title)}</title>`
    );

    // Replace description meta
    html = html.replace(
      /<meta\s+name=["']description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
      `<meta name="description" content="${escapeHtml(meta.description)}" />`
    );

    // Replace canonical link
    html = html.replace(
      /<link\s+rel=["']canonical["']\s+href=["'][\s\S]*?["']\s*\/?>/i,
      `<link rel="canonical" href="${meta.canonical}" />`
    );

    // Replace OpenGraph title & description & url
    html = html.replace(
      /<meta\s+property=["']og:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
      `<meta property="og:title" content="${escapeHtml(meta.title)}" />`
    );
    html = html.replace(
      /<meta\s+property=["']og:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
      `<meta property="og:description" content="${escapeHtml(meta.description)}" />`
    );
    html = html.replace(
      /<meta\s+property=["']og:url["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
      `<meta property="og:url" content="${meta.canonical}" />`
    );

    // Replace Twitter title & description
    html = html.replace(
      /<meta\s+name=["']twitter:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
      `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`
    );
    html = html.replace(
      /<meta\s+name=["']twitter:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
      `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`
    );

    // Replace JSON-LD structured data if provided
    if (meta.structuredData) {
      const jsonLdString = JSON.stringify(meta.structuredData, null, 2);
      html = html.replace(
        /<script\s+id=["']dynamic-jsonld["']\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/i,
        `<script id="dynamic-jsonld" type="application/ld+json">\n${jsonLdString}\n    </script>`
      );
    }

    // Inject prerendered body markup inside <div id="root"></div>
    html = html.replace(
      /<div\s+id=["']root["']><\/div>/i,
      `<div id="root">${meta.bodyHtml}</div>`
    );

    // Determine target file path
    let targetFilePath = templatePath;
    if (routePath !== '/' && routePath !== '') {
      const trimmed = routePath.replace(/^\//, '').replace(/\/$/, '');
      const outDir = path.join(DIST_DIR, trimmed);
      fs.mkdirSync(outDir, { recursive: true });
      targetFilePath = path.join(outDir, 'index.html');
    }

    fs.writeFileSync(targetFilePath, html, 'utf-8');
    count++;
  }

  // Generate static sitemap.xml for both dist and public
  const sitemapXml = generateXmlSitemap();
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf-8');
  const publicDir = path.resolve(__dirname, '../public');
  if (fs.existsSync(publicDir)) {
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  }
  console.log(`Successfully generated static sitemap.xml in dist/ and public/`);
  console.log(`Successfully pre-rendered ${count} static HTML files!`);
}

prerender();

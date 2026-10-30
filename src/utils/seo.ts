/**
 * Client-Side SEO metadata updater
 * Dynamically synchronizes document title, description, canonical link,
 * OpenGraph, Twitter tags and Schema.org JSON-LD as user navigates.
 */

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonicalPath?: string;
  image?: string;
  noindex?: boolean;
  structuredData?: Record<string, unknown>;
}

const BASE_URL = 'https://image-compress.cloud';

export function updatePageSeo(config: SeoConfig) {
  const brand = 'Image Compress Cloud';
  // Avoid duplicate brand suffix if title already contains 'Image Compress Cloud'
  const fullTitle = config.title.toLowerCase().includes(brand.toLowerCase())
    ? config.title
    : `${config.title} | ${brand}`;

  document.title = fullTitle;

  // Helper to set or create meta tag
  const setMeta = (attrName: string, attrVal: string, content: string) => {
    let el = document.querySelector(`meta[${attrName}="${attrVal}"]`) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attrName, attrVal);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // Standard SEO
  setMeta('name', 'description', config.description);
  if (config.keywords && config.keywords.length > 0) {
    setMeta('name', 'keywords', config.keywords.join(', '));
  } else {
    const kwEl = document.querySelector('meta[name="keywords"]');
    if (kwEl) kwEl.remove();
  }

  // Robots indexing directive
  let robotsEl = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
  if (config.noindex) {
    if (!robotsEl) {
      robotsEl = document.createElement('meta');
      robotsEl.setAttribute('name', 'robots');
      document.head.appendChild(robotsEl);
    }
    robotsEl.setAttribute('content', 'noindex, nofollow');
  } else if (robotsEl) {
    robotsEl.remove();
  }

  // Canonical URL - standardized without trailing slash for root and routes
  let path = config.canonicalPath !== undefined ? config.canonicalPath : window.location.pathname;
  if (!path || path === '/') {
    path = '';
  } else {
    path = path.replace(/\/+$/, '');
  }
  const canonicalUrl = `${BASE_URL}${path}`;

  let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', canonicalUrl);

  // Social Share Image
  const shareImage = config.image || `${BASE_URL}/og-banner.png`;

  // Open Graph
  const socialTitle = config.title.toLowerCase().includes(brand.toLowerCase())
    ? config.title
    : `${config.title} - ${brand}`;

  setMeta('property', 'og:title', socialTitle);
  setMeta('property', 'og:description', config.description);
  setMeta('property', 'og:url', canonicalUrl);
  setMeta('property', 'og:image', shareImage);
  setMeta('property', 'og:image:width', '1200');
  setMeta('property', 'og:image:height', '630');
  setMeta('property', 'og:locale', 'en_IN');

  // Twitter
  setMeta('name', 'twitter:title', socialTitle);
  setMeta('name', 'twitter:description', config.description);
  setMeta('name', 'twitter:image', shareImage);

  // Dynamic Schema.org JSON-LD
  const existingScript = document.getElementById('dynamic-jsonld');
  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: brand,
    url: BASE_URL,
    description: 'Free online client-side photo, signature, and thumb impression compressor and resizer tailored for all Indian competitive exams.',
  };
  const schemaToUse = config.structuredData || defaultSchema;
  const scriptEl = (existingScript as HTMLScriptElement) || document.createElement('script');
  scriptEl.id = 'dynamic-jsonld';
  scriptEl.type = 'application/ld+json';
  scriptEl.textContent = JSON.stringify(schemaToUse);
  if (!existingScript) document.head.appendChild(scriptEl);
}

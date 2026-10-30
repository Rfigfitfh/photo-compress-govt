import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ExamToolPage } from './pages/ExamToolPage';
import { DedicatedToolPage } from './pages/DedicatedToolPage';
import { UniversalToolPage } from './pages/UniversalToolPage';
import { AdSensePages } from './pages/AdSensePages';
import { BlogPage } from './pages/BlogPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { EXAM_BODIES } from './data/examBodies';
import { DEDICATED_TOOLS } from './data/dedicatedTools';

const normalizePath = (path: string): string => {
  if (!path || path === '/') return '/';
  const clean = path.split('?')[0].split('#')[0];
  return clean.replace(/\/+$/, '') || '/';
};

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return normalizePath(window.location.pathname);
  });

  // Handle browser back and forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    const target = normalizePath(path);
    if (target !== currentPath) {
      window.history.pushState({}, '', target);
      setCurrentPath(target);
      window.scrollTo(0, 0);
    }
  };

  // Route Dispatcher
  const renderCurrentView = () => {
    // Exact home
    if (currentPath === '/' || currentPath === '') {
      return <HomePage onNavigate={navigate} />;
    }

    // Individual Dedicated Exam Tool: /tool/:slug (e.g. /tool/ssc-signature-resize, /tool/upsc-photo-resize)
    if (currentPath.startsWith('/tool/')) {
      const slug = currentPath.replace('/tool/', '').split('/')[0];
      const tool = DEDICATED_TOOLS.find((t) => t.slug === slug || t.id === slug);
      if (tool) {
        return <DedicatedToolPage tool={tool} onNavigate={navigate} />;
      }
    }

    // Exam specific dedicated hub page: /exam/:slug
    if (currentPath.startsWith('/exam/')) {
      const slug = currentPath.replace('/exam/', '').split('/')[0];
      const exam = EXAM_BODIES.find((e) => e.slug === slug || e.id === slug);
      if (exam) {
        return <ExamToolPage exam={exam} onNavigate={navigate} />;
      }
    }

    // Universal Standalone Tools
    if (currentPath === '/tools/photo-compressor') {
      return <UniversalToolPage toolType="photo" onNavigate={navigate} />;
    }
    if (currentPath === '/tools/signature-resize') {
      return <UniversalToolPage toolType="signature" onNavigate={navigate} />;
    }
    if (currentPath === '/tools/thumb-impression') {
      return <UniversalToolPage toolType="thumb" onNavigate={navigate} />;
    }
    if (currentPath === '/tools/name-date-on-photo') {
      return <UniversalToolPage toolType="namedate" onNavigate={navigate} />;
    }

    // Blog / Guides
    if (currentPath === '/blog') {
      return <BlogPage onNavigate={navigate} />;
    }
    if (currentPath.startsWith('/blog/')) {
      const postSlug = currentPath.replace('/blog/', '').split('/')[0];
      return <BlogPage onNavigate={navigate} postSlug={postSlug} />;
    }

    // AdSense & Legal Pages
    if (currentPath === '/about') {
      return <AdSensePages pageType="about" onNavigate={navigate} />;
    }
    if (currentPath === '/privacy-policy') {
      return <AdSensePages pageType="privacy" onNavigate={navigate} />;
    }
    if (currentPath === '/terms-of-service') {
      return <AdSensePages pageType="terms" onNavigate={navigate} />;
    }
    if (currentPath === '/contact') {
      return <AdSensePages pageType="contact" onNavigate={navigate} />;
    }
    if (currentPath === '/disclaimer') {
      return <AdSensePages pageType="disclaimer" onNavigate={navigate} />;
    }
    if (currentPath === '/cookie-policy') {
      return <AdSensePages pageType="cookie" onNavigate={navigate} />;
    }
    if (currentPath === '/sitemap') {
      return <AdSensePages pageType="sitemap" onNavigate={navigate} />;
    }
    if (currentPath === '/sitemap.xml') {
      return <AdSensePages pageType="xml-sitemap" onNavigate={navigate} />;
    }

    // Fallback: Custom 404 Page (Google Search Console friendly)
    return <NotFoundPage onNavigate={navigate} currentPath={currentPath} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 font-sans selection:bg-amber-200 selection:text-amber-950">
      <Navbar currentPath={currentPath} onNavigate={navigate} />
      <main className="flex-1">
        {renderCurrentView()}
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
}

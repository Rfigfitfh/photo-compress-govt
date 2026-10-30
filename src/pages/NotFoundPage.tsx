import React, { useEffect } from 'react';
import { ArrowLeft, Home, Search, Camera, PenTool, Fingerprint } from 'lucide-react';
import { updatePageSeo } from '../utils/seo';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
  currentPath?: string;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate, currentPath }) => {
  useEffect(() => {
    updatePageSeo({
      title: '404 - Page Not Found',
      description: 'The requested tool or exam page could not be found on Image Compress Cloud. Browse our complete Indian examination directory.',
      canonicalPath: '/404',
      noindex: true,
    });
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] border border-[#E5DFD3] rounded-3xl p-8 sm:p-14 shadow-sm space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100 text-amber-900 border border-amber-200 font-serif font-bold text-2xl shadow-xs">
          404
        </div>

        <h1 className="font-serif font-bold text-2xl sm:text-4xl text-stone-900">
          Page or Tool Not Found
        </h1>

        <p className="text-sm sm:text-base text-stone-600 max-w-lg mx-auto leading-relaxed">
          The link you followed{currentPath ? ` (${currentPath})` : ''} does not exist or may have been updated. You can choose from our popular tools below or return to the main examination directory.
        </p>

        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/');
            }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-sm transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Go to Home Directory
          </a>

          <a
            href="/tools/photo-compressor"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/tools/photo-compressor');
            }}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#EFE8DD] hover:bg-[#E5DECF] text-stone-800 font-medium text-sm border border-[#DDD5C7] transition-colors cursor-pointer"
          >
            <Camera className="w-4 h-4 text-amber-700" />
            Photo Resizer
          </a>

          <a
            href="/tools/signature-resize"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/tools/signature-resize');
            }}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#EFE8DD] hover:bg-[#E5DECF] text-stone-800 font-medium text-sm border border-[#DDD5C7] transition-colors cursor-pointer"
          >
            <PenTool className="w-4 h-4 text-blue-700" />
            Signature Resizer
          </a>
        </div>
      </div>
    </div>
  );
};

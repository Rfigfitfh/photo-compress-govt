import React from 'react';
import { Camera, ShieldCheck, Zap, Lock, ExternalLink } from 'lucide-react';
import { EXAM_BODIES } from '../data/examBodies';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const popularExams = EXAM_BODIES.filter((e) => e.popular).slice(0, 10);

  return (
    <footer className="bg-[#F4EFE6] border-t border-[#E3DBCF] text-stone-700 text-sm mt-20">
      {/* Trust & Performance Highlights */}
      <div className="border-b border-[#E3DBCF] bg-[#ECE5DA]/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-200">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-stone-900">0.5s Instant Browser Processing</h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Zero queue time. Pure client-side HTML5 canvas algorithms resize and compress high-resolution photos in milliseconds.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-200">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-stone-900">100% Private & Device Safe</h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Your biometric documents, signatures, and personal photos never leave your device or touch any remote server.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-blue-100 text-blue-900 border border-blue-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-stone-900">Pre-Configured Exam Bounds</h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Official KB ranges, pixel ratios, DPI tags, and name/date guidelines for UPSC, SSC, IBPS, NTA, and all Indian states.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center">
                <Camera className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-lg text-stone-900">
                image compress cloud
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed pr-6">
              India&apos;s fastest specialized photograph, signature, and left thumb impression resizer & compressor. Pre-calibrated for all Central and State government recruitment examinations, police recruitment boards, teaching eligibility tests, and national entrance exams.
            </p>
            <div className="bg-[#ECE5DA] border border-[#DDD5C7] rounded-xl p-3 text-xs text-stone-700 space-y-1">
              <p><strong>Administrator:</strong> Sumit Dal</p>
              <p><strong>Address:</strong> Odisha, India</p>
              <p><strong>Mobile:</strong> +91 7789090050</p>
              <p><strong>Email:</strong> <a href="mailto:sumitdal125@gmail.com" className="text-amber-800 underline">sumitdal125@gmail.com</a></p>
            </div>
            <div className="text-xs text-stone-500 space-y-1">
              <p>Canonical Domain: <strong className="text-stone-700">image-compress.cloud</strong></p>
              <p>Technology: HTML5 Offscreen Canvas, Binary Search Quantization, JFIF DPI Injector.</p>
            </div>
          </div>

          {/* Dedicated Exam Tools */}
          <div>
            <h4 className="font-semibold text-stone-900 text-xs uppercase tracking-wider mb-3">
              Popular Dedicated Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/tool/ssc-signature-resize"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/tool/ssc-signature-resize');
                  }}
                  className="hover:text-amber-800 transition-colors block text-left"
                >
                  SSC Signature Resizer (10-20KB)
                </a>
              </li>
              <li>
                <a
                  href="/tool/ssc-photo-resize"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/tool/ssc-photo-resize');
                  }}
                  className="hover:text-amber-800 transition-colors block text-left"
                >
                  SSC Photo Resizer (20-50KB)
                </a>
              </li>
              <li>
                <a
                  href="/tool/upsc-photo-resize"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/tool/upsc-photo-resize');
                  }}
                  className="hover:text-amber-800 transition-colors block text-left"
                >
                  UPSC OTR Photo Resizer
                </a>
              </li>
              <li>
                <a
                  href="/tool/ibps-thumb-impression-resize"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/tool/ibps-thumb-impression-resize');
                  }}
                  className="hover:text-amber-800 transition-colors block text-left"
                >
                  IBPS Thumb Impression (20-50KB)
                </a>
              </li>
              <li>
                <a
                  href="/tool/kerala-psc-photo-resize"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/tool/kerala-psc-photo-resize');
                  }}
                  className="hover:text-amber-800 transition-colors block text-left"
                >
                  Kerala PSC Photo (150x200 px)
                </a>
              </li>
              <li>
                <a
                  href="/tool/dsssb-photo-resize"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/tool/dsssb-photo-resize');
                  }}
                  className="hover:text-amber-800 transition-colors block text-left"
                >
                  DSSSB Postcard (480x672 px)
                </a>
              </li>
              <li>
                <a
                  href="/tool/gpsc-photo-resize"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/tool/gpsc-photo-resize');
                  }}
                  className="hover:text-amber-800 transition-colors block text-left"
                >
                  OJAS Gujarat Photo (15 KB)
                </a>
              </li>
            </ul>
          </div>

          {/* Universal Utilities */}
          <div>
            <h4 className="font-semibold text-stone-900 text-xs uppercase tracking-wider mb-3">
              Online Image Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/tools/photo-compressor"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/tools/photo-compressor');
                  }}
                  className="hover:text-amber-800 transition-colors block text-left"
                >
                  Universal Photo Resizer
                </a>
              </li>
              <li>
                <a
                  href="/tools/signature-resize"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/tools/signature-resize');
                  }}
                  className="hover:text-amber-800 transition-colors block text-left"
                >
                  Signature Resizer (10-20KB)
                </a>
              </li>
              <li>
                <a
                  href="/tools/thumb-impression"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/tools/thumb-impression');
                  }}
                  className="hover:text-amber-800 transition-colors block text-left"
                >
                  Thumb Impression Cleaner
                </a>
              </li>
              <li>
                <a
                  href="/tools/name-date-on-photo"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/tools/name-date-on-photo');
                  }}
                  className="hover:text-amber-800 transition-colors block text-left"
                >
                  Add Name & Date on Photo
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/blog');
                  }}
                  className="hover:text-amber-800 transition-colors block text-left"
                >
                  Exam Portal Guidelines Blog
                </a>
              </li>
            </ul>
          </div>

          {/* AdSense Mandatory Pages */}
          <div>
            <h4 className="font-semibold text-stone-900 text-xs uppercase tracking-wider mb-3">
              Legal & AdSense Pages
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/about"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/about');
                  }}
                  className="hover:text-amber-800 transition-colors block"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/privacy-policy');
                  }}
                  className="hover:text-amber-800 transition-colors block"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms-of-service"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/terms-of-service');
                  }}
                  className="hover:text-amber-800 transition-colors block"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/contact');
                  }}
                  className="hover:text-amber-800 transition-colors block"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="/disclaimer"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/disclaimer');
                  }}
                  className="hover:text-amber-800 transition-colors block"
                >
                  Disclaimer Notice
                </a>
              </li>
              <li>
                <a
                  href="/cookie-policy"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/cookie-policy');
                  }}
                  className="hover:text-amber-800 transition-colors block"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href="/sitemap"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/sitemap');
                  }}
                  className="hover:text-amber-800 transition-colors block"
                >
                  HTML Sitemap
                </a>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/sitemap.xml');
                  }}
                  className="hover:text-amber-800 transition-colors block font-medium text-amber-900"
                >
                  XML Sitemap (sitemap.xml)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* AdSense Legal & Government Disclaimer */}
        <div className="mt-10 pt-6 border-t border-[#E3DBCF] text-[11px] text-stone-500 leading-relaxed space-y-2">
          <p>
            <strong>Disclaimer:</strong> Image Compress Cloud (<a href="https://image-compress.cloud" className="underline hover:text-stone-700">https://image-compress.cloud</a>) is a completely independent candidate educational and technical utility website. We are <strong>NOT</strong> affiliated, associated, authorized, endorsed by, or in any way officially connected with the Union Public Service Commission (UPSC), Staff Selection Commission (SSC), National Testing Agency (NTA), Institute of Banking Personnel Selection (IBPS), State Bank of India (SBI), or any Central or State Government recruiting agency or examination board.
          </p>
          <p>
            All registered trademarks, examination acronyms, and institutional names are the property of their respective owners. Their mention on this website is solely for descriptive reference to guide candidates in complying with published photo dimension guidelines. Candidates are strongly advised to always cross-check their respective official examination notifications.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-[#E3DBCF] flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <p>© 2026 Image Compress Cloud (image-compress.cloud). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Client-Side Fast Engine Active
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

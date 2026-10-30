import React, { useState } from 'react';
import { 
  Camera, 
  Search, 
  ShieldCheck, 
  Menu, 
  X, 
  FileText, 
  Sparkles, 
  PenTool, 
  Fingerprint, 
  Calendar 
} from 'lucide-react';
import { EXAM_BODIES } from '../data/examBodies';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // Tokenized search query across name, fullName, state, category, and keywords
  const searchTokens = searchQuery
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter((t) => t.length > 0 && t !== '&');

  const filteredExams =
    searchTokens.length > 0
      ? EXAM_BODIES.filter((e) => {
          const searchableText = `${e.name} ${e.fullName} ${e.state} ${e.category} ${e.seoTitle} ${e.seoDescription} ${e.seoKeywords.join(' ')}`.toLowerCase();
          return searchTokens.every((token) => searchableText.includes(token));
        })
      : [];

  const handleSelectExam = (slug: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    onNavigate(`/exam/${slug}`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E6E0D5] transition-all">
        {/* Top announcement banner */}
        <div className="bg-[#F2ECE1] text-[#635544] text-xs py-1.5 px-4 text-center border-b border-[#E6E0D5] flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            100% Private & Secure:
          </span>
          <span className="hidden sm:inline">Images are processed directly in your browser. No files are uploaded to any server.</span>
          <span className="sm:hidden">Zero server uploads. 100% private.</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/');
              }}
              className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none min-w-0"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-sm shadow-amber-900/10 group-hover:bg-amber-700 transition-colors shrink-0">
                <Camera className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-serif font-bold text-base sm:text-xl text-stone-900 tracking-tight leading-none truncate">
                  image compress cloud
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[9px] font-sans font-semibold uppercase bg-amber-100 text-amber-800 px-1 py-0.5 rounded border border-amber-200">
                    India Exams
                  </span>
                  <span className="text-[10px] text-stone-500 font-medium hidden sm:inline">Auto Resize to Exact KB</span>
                </div>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/');
                }}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentPath === '/' ? 'text-amber-800 bg-[#EFE9DD]' : 'text-stone-700 hover:text-stone-900 hover:bg-[#F2ECE1]'
                }`}
              >
                All Exams Directory
              </a>

              <a
                href="/tools/photo-compressor"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/tools/photo-compressor');
                }}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                  currentPath === '/tools/photo-compressor' ? 'text-amber-800 bg-[#EFE9DD]' : 'text-stone-700 hover:text-stone-900 hover:bg-[#F2ECE1]'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                Photo Resizer
              </a>

              <a
                href="/tools/signature-resize"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/tools/signature-resize');
                }}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                  currentPath === '/tools/signature-resize' ? 'text-amber-800 bg-[#EFE9DD]' : 'text-stone-700 hover:text-stone-900 hover:bg-[#F2ECE1]'
                }`}
              >
                <PenTool className="w-4 h-4 text-blue-600" />
                Signature (10-20KB)
              </a>

              <a
                href="/tools/thumb-impression"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/tools/thumb-impression');
                }}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                  currentPath === '/tools/thumb-impression' ? 'text-amber-800 bg-[#EFE9DD]' : 'text-stone-700 hover:text-stone-900 hover:bg-[#F2ECE1]'
                }`}
              >
                <Fingerprint className="w-4 h-4 text-purple-600" />
                Thumb Impression
              </a>

              <a
                href="/tools/name-date-on-photo"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/tools/name-date-on-photo');
                }}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                  currentPath === '/tools/name-date-on-photo' ? 'text-amber-800 bg-[#EFE9DD]' : 'text-stone-700 hover:text-stone-900 hover:bg-[#F2ECE1]'
                }`}
              >
                <Calendar className="w-4 h-4 text-emerald-600" />
                Name & Date Stamp
              </a>

              <a
                href="/blog"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/blog');
                }}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                  currentPath.startsWith('/blog') ? 'text-amber-800 bg-[#EFE9DD]' : 'text-stone-700 hover:text-stone-900 hover:bg-[#F2ECE1]'
                }`}
              >
                <FileText className="w-4 h-4 text-stone-500" />
                Exam Guides
              </a>
            </nav>

            {/* Search Trigger Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search exam photo resizer"
                className="flex items-center gap-2 text-xs font-medium text-stone-600 bg-[#F2ECE1] hover:bg-[#EAE2D4] border border-[#DDD5C7] px-3 py-2 rounded-lg transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-stone-500" />
                <span className="hidden sm:inline">Search any exam (UPSC, SSC, BPSC...)</span>
                <span className="sm:hidden">Search</span>
                <kbd className="hidden md:inline-block bg-[#E6DECF] text-stone-600 text-[10px] px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle navigation menu"
                className="lg:hidden p-2 text-stone-700 hover:bg-[#EFE9DD] rounded-lg cursor-pointer"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E6E0D5] bg-[#FAF8F5] px-4 pt-3 pb-5 space-y-2">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                onNavigate('/');
              }}
              className="block w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-[#F2ECE1] text-stone-800"
            >
              All Indian Exams Directory
            </a>
            <a
              href="/tools/photo-compressor"
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                onNavigate('/tools/photo-compressor');
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-[#F2ECE1] text-stone-800 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              Photo Resizer (KB & Pixels)
            </a>
            <a
              href="/tools/signature-resize"
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                onNavigate('/tools/signature-resize');
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-[#F2ECE1] text-stone-800 flex items-center gap-2"
            >
              <PenTool className="w-4 h-4 text-blue-600" />
              Signature Resizer (10-20KB)
            </a>
            <a
              href="/tools/thumb-impression"
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                onNavigate('/tools/thumb-impression');
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-[#F2ECE1] text-stone-800 flex items-center gap-2"
            >
              <Fingerprint className="w-4 h-4 text-purple-600" />
              Thumb Impression (20-50KB)
            </a>
            <a
              href="/tools/name-date-on-photo"
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                onNavigate('/tools/name-date-on-photo');
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-[#F2ECE1] text-stone-800 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-emerald-600" />
              Name & Date On Photo Tool
            </a>
            <a
              href="/blog"
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                onNavigate('/blog');
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-[#F2ECE1] text-stone-800 flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-stone-500" />
              Blog & Upload Rules Guide
            </a>
          </div>
        )}
      </header>

      {/* Global Search Dialog */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-[#FAF8F5] border border-[#DDD5C7] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-[#E6E0D5] flex items-center gap-3">
              <Search className="w-5 h-5 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any exam: SSC CGL, UPSC, BPSC, UP Police, NEET, OJAS..."
                className="w-full bg-transparent text-base text-stone-900 placeholder:text-stone-400 focus:outline-none font-medium"
                autoFocus
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-[#EFE9DD] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-2 divide-y divide-[#EFE9DD]">
              {searchQuery.trim() === '' ? (
                <div className="p-6 text-center text-sm text-stone-500">
                  <p className="font-medium text-stone-700">Quick Searches for Indian Exams:</p>
                  <div className="flex flex-wrap justify-center gap-2 mt-3">
                    {['UPSC Civil Services', 'SSC CGL & CHSL', 'IBPS PO & Clerk', 'NEET UG 2026', 'UP Police', 'BPSC Bihar', 'RPSC Rajasthan'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSearchQuery(tag)}
                        className="text-xs bg-[#EFE9DD] hover:bg-[#E5DECF] text-stone-800 px-3 py-1.5 rounded-lg border border-[#DDD5C7] transition-colors cursor-pointer"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              ) : filteredExams.length === 0 ? (
                <div className="p-8 text-center text-stone-500 text-sm">
                  No exam body found for &quot;{searchQuery}&quot;. You can use our Universal Photo or Signature Compressor tool for any custom size.
                </div>
              ) : (
                filteredExams.map((exam) => (
                  <a
                    key={exam.id}
                    href={`/exam/${exam.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSelectExam(exam.slug);
                    }}
                    className="w-full p-3 text-left hover:bg-[#F2ECE1] rounded-xl flex items-center justify-between transition-colors group block"
                  >
                    <div>
                      <div className="font-semibold text-stone-900 group-hover:text-amber-800 flex items-center gap-2">
                        {exam.name}
                        <span className="text-[11px] font-normal text-stone-500 bg-[#EAE2D4] px-2 py-0.5 rounded">
                          {exam.state}
                        </span>
                      </div>
                      <div className="text-xs text-stone-500 mt-0.5">
                        Photo: {exam.photo.minKB}-{exam.photo.maxKB} KB | Sig: {exam.signature.minKB}-{exam.signature.maxKB} KB
                      </div>
                    </div>
                    <span className="text-xs font-medium text-amber-700 bg-amber-50 group-hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-lg">
                      Open Tool →
                    </span>
                  </a>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

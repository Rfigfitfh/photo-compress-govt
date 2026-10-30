import React, { useState, useEffect, useMemo } from 'react';
import { 
  Camera, 
  PenTool, 
  Fingerprint, 
  Calendar, 
  Search, 
  Filter, 
  CheckCircle, 
  ShieldCheck, 
  Zap, 
  Clock, 
  FileText, 
  ArrowRight, 
  ChevronDown, 
  Sliders, 
  HelpCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { EXAM_BODIES, ALL_INDIAN_STATES, BLOG_POSTS } from '../data/examBodies';
import { DEDICATED_TOOLS } from '../data/dedicatedTools';
import { ExamCard } from '../components/ExamCard';
import { ImageToolWorkspace } from '../components/ImageToolWorkspace';
import { updatePageSeo } from '../utils/seo';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [selectedState, setSelectedState] = useState<string>('All States & National');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'tools'>('cards');

  useEffect(() => {
    updatePageSeo({
      title: 'Indian Exam Photo & Signature Resizer (Exact KB)',
      description: 'Auto compress and resize photo, signature, and thumb impression to exact KB for UPSC, SSC, IBPS, NTA, and all Indian state exam bodies.',
      keywords: [
        'photo compress for exam',
        'ssc photo resize 20 to 50 kb',
        'upsc signature resize',
        'ibps thumb impression resize',
        'image compress cloud',
        'online photo resizer in kb',
        'bpsc signature 10 to 20 kb',
        'neet photo with name and date',
      ],
      canonicalPath: '/',
      structuredData: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            name: 'Image Compress Cloud',
            url: 'https://image-compress.cloud',
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: 'All',
            description: 'Free client-side photo, signature, and thumb impression compressor and resizer tailored for all Indian competitive exams.',
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
                name: 'How does Image Compress Cloud ensure my photo is within the exact KB limit?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Our engine uses an iterative binary-search quantization loop directly in your browser. It calculates the byte size of the JPEG compressed output and dynamically steps through quality values until the file lands precisely within the exam minKB and maxKB boundaries.',
                },
              },
              {
                '@type': 'Question',
                name: 'Are my uploaded photographs or signatures stored on your server?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'No. Never. Image Compress Cloud operates 100% locally on your device using HTML5 Offscreen Canvas and Pica.js memory. No image files are ever uploaded, transmitted, or saved to any remote cloud server.',
                },
              },
              {
                '@type': 'Question',
                name: 'How do I add my Name and Date of Taking Photo (DOP)?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Toggle the "Print Candidate Name & Date of Photo (DOP)" option in the fine controls or use our dedicated Name & Date Tool. It generates a crisp white rectangular banner at the bottom with official government typography.',
                },
              },
              {
                '@type': 'Question',
                name: 'Why did the SSC or UPSC portal say "Signature must be in running handwriting"?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Recruiting commissions like SSC and IBPS explicitly disqualify applications where the candidate signs in capital (block) letters. Always sign with running handwriting on plain white paper with black ink.',
                },
              },
              {
                '@type': 'Question',
                name: 'Can I resize photos for state exams like BPSC, UPPSC, or OJAS Gujarat?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes! We have pre-calibrated profiles for all 28+ Indian states, including OJAS Gujarat ultra-strict 15 KB limit, Kerala PSC 150x200 px format, and DSSSB 5x7 postcard format.',
                },
              },
            ],
          },
          {
            '@type': 'HowTo',
            name: 'How to Resize Documents for Indian Exams',
            description: 'Step-by-step guide to compress and resize photos, signatures, and thumb impressions to exact government portal KB specifications.',
            step: [
              {
                '@type': 'HowToStep',
                position: 1,
                name: 'Select Exam Specification',
                text: 'Select your examination board (SSC, UPSC, IBPS, or State PSC). The exact KB boundaries, dimensions, and background rules auto-calibrate immediately.',
              },
              {
                '@type': 'HowToStep',
                position: 2,
                name: 'Upload Document & Auto-Format',
                text: 'Drag and drop your photo or signature. Our Pica.js and Canvas engine auto-crops, sharpens ink, and fits exact dimensions in under 0.5 seconds.',
              },
              {
                '@type': 'HowToStep',
                position: 3,
                name: 'Download Portal-Ready File',
                text: 'Review the instant live preview and verified "Portal Ready" compliance badge. Download with pre-tagged file naming for instant portal submission.',
              },
            ],
          },
        ],
      },
    });
  }, []);

  // Filter exam list
  const filteredExams = useMemo(() => {
    return EXAM_BODIES.filter((exam) => {
      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.seoKeywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));

      // State filter
      const matchesState =
        selectedState === 'All States & National' ||
        exam.state === selectedState ||
        (selectedState === 'Central / All India' && exam.category === 'National');

      // Category filter
      const matchesCategory =
        selectedCategory === 'All' ||
        (selectedCategory === 'Popular' && exam.popular) ||
        exam.category === selectedCategory;

      return matchesSearch && matchesState && matchesCategory;
    });
  }, [searchQuery, selectedState, selectedCategory]);

  // Filter individual dedicated tools
  const filteredDedicatedTools = useMemo(() => {
    return DEDICATED_TOOLS.filter((tool) => {
      const matchesSearch =
        searchQuery === '' ||
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.examName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.seoKeywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesState =
        selectedState === 'All States & National' ||
        tool.state === selectedState ||
        (selectedState === 'Central / All India' && tool.state.includes('Central'));

      return matchesSearch && matchesState;
    });
  }, [searchQuery, selectedState]);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F7F2EB] to-[#FAF8F5] border-b border-[#E8E1D5] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#EFE8DD] text-stone-800 text-xs font-semibold px-3 py-1.5 rounded-full border border-[#DDD5C7] shadow-xs">
              <Zap className="w-3.5 h-3.5 text-amber-700" />
              <span>0.5-Second In-Browser Execution • All Indian Exam Bodies</span>
            </div>

            <h1 className="font-serif font-bold text-3xl sm:text-5xl text-stone-900 tracking-tight leading-[1.15]">
              Indian Exam Photo, Signature & Thumb Resizer
            </h1>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Every exam body has its own strict size in KB already calibrated. Simply upload your photo or signature—it automatically compresses and resizes to the exact government portal specifications.
            </p>

            {/* Quick feature pill highlights */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-medium text-stone-600">
              <span className="flex items-center gap-1.5 bg-[#FAF8F5] px-3 py-1.5 rounded-lg border border-[#E3DCD0]">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> 100% Client-Side Privacy
              </span>
              <span className="flex items-center gap-1.5 bg-[#FAF8F5] px-3 py-1.5 rounded-lg border border-[#E3DCD0]">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Exact KB Bounds
              </span>
              <span className="flex items-center gap-1.5 bg-[#FAF8F5] px-3 py-1.5 rounded-lg border border-[#E3DCD0]">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Name & Date (DOP) Stamp
              </span>
              <span className="flex items-center gap-1.5 bg-[#FAF8F5] px-3 py-1.5 rounded-lg border border-[#E3DCD0]">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Signature Contrast Filter
              </span>
            </div>
          </div>

          {/* Quick Universal Compressor Workspace Mounted Right in Hero */}
          <div className="mt-10 max-w-4xl mx-auto">
            <div className="bg-[#FAF8F5] rounded-2xl p-2 sm:p-3 shadow-md border border-[#DFD7CA]">
              <div className="bg-[#F2ECE1] px-4 py-2.5 rounded-xl border border-[#E2DAD0] flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  Quick Instant Resizer (Try it right now)
                </span>
                <span className="text-[11px] text-stone-500 font-medium">Pre-set: 20 KB to 50 KB</span>
              </div>
              <ImageToolWorkspace
                toolType="photo"
                examName="Universal Exam"
                spec={{
                  minKB: 20,
                  maxKB: 50,
                  exactWidth: 350,
                  exactHeight: 450,
                  aspectRatio: '3.5:4.5',
                  format: 'JPEG',
                  notes: 'Universal government exam preset. Test with 1-click sample button or upload.',
                  requireNameDate: true,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4 Dedicated Tool Shortcuts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/tools/photo-compressor"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/tools/photo-compressor');
            }}
            className="text-left bg-[#FAF8F5] hover:bg-[#F5EFE6] border border-[#E5DFD3] hover:border-amber-600/60 rounded-2xl p-5 shadow-xs transition-all group block cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 border border-amber-200 flex items-center justify-center mb-3 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-stone-900 group-hover:text-amber-800">
              Photo Resizer
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Compress to 20-50KB, 50-100KB, or custom resolution in seconds.
            </p>
            <span className="text-xs font-semibold text-amber-700 mt-3 inline-flex items-center gap-1">
              Open Tool →
            </span>
          </a>

          <a
            href="/tools/signature-resize"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/tools/signature-resize');
            }}
            className="text-left bg-[#FAF8F5] hover:bg-[#F5EFE6] border border-[#E5DFD3] hover:border-amber-600/60 rounded-2xl p-5 shadow-xs transition-all group block cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 border border-blue-200 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <PenTool className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-stone-900 group-hover:text-amber-800">
              Signature (10-20KB)
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Auto contrast enhancement, removes shadows, and whitens paper.
            </p>
            <span className="text-xs font-semibold text-amber-700 mt-3 inline-flex items-center gap-1">
              Open Tool →
            </span>
          </a>

          <a
            href="/tools/thumb-impression"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/tools/thumb-impression');
            }}
            className="text-left bg-[#FAF8F5] hover:bg-[#F5EFE6] border border-[#E5DFD3] hover:border-amber-600/60 rounded-2xl p-5 shadow-xs transition-all group block cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 border border-purple-200 flex items-center justify-center mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Fingerprint className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-stone-900 group-hover:text-amber-800">
              Thumb Impression
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Boost ridge sharpness, crop 240x240 px, and format to 20-50KB.
            </p>
            <span className="text-xs font-semibold text-amber-700 mt-3 inline-flex items-center gap-1">
              Open Tool →
            </span>
          </a>

          <a
            href="/tools/name-date-on-photo"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/tools/name-date-on-photo');
            }}
            className="text-left bg-[#FAF8F5] hover:bg-[#F5EFE6] border border-[#E5DFD3] hover:border-amber-600/60 rounded-2xl p-5 shadow-xs transition-all group block cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-200 flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-stone-900 group-hover:text-amber-800">
              Name & Date Stamp
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Renders official DOP strip required by SSC, UPPSC, & Kerala PSC.
            </p>
            <span className="text-xs font-semibold text-amber-700 mt-3 inline-flex items-center gap-1">
              Open Tool →
            </span>
          </a>
        </div>
      </section>

      {/* Main Exam Directory with Search & State Selector */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-900">
              India-Wide Exam Directory
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900">
              Find Your Examination Body
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Choose from all Central Government recruiting bodies and all 28+ Indian States & Union Territories.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#F2ECE1] p-1 rounded-xl border border-[#DDD5C7] self-start md:self-auto">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'cards'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              Exam Boards ({filteredExams.length})
            </button>
            <button
              onClick={() => setViewMode('tools')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'tools'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              All Dedicated Tools ({filteredDedicatedTools.length})
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-[#FAF8F5] border border-[#E5DFD3] rounded-2xl p-4 sm:p-5 mb-8 shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any tool: SSC Signature, UPSC Photo, BPSC, UP Police..."
                className="w-full text-xs sm:text-sm bg-[#FFFFFF] border border-[#DDD5C7] rounded-xl pl-9 pr-4 py-2.5 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-600"
              />
            </div>

            {/* State Dropdown */}
            <div className="md:col-span-6 relative">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full text-xs sm:text-sm bg-[#FFFFFF] border border-[#DDD5C7] rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-amber-600 cursor-pointer font-medium"
              >
                {ALL_INDIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Filter Pills (When in exam board view) */}
          {viewMode === 'cards' && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-stone-500 font-medium mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                Category:
              </span>
              {['All', 'Popular', 'National', 'Banking', 'State PSC & Police', 'Engineering & Medical', 'Defence', 'Teaching'].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-[#F2ECE1] text-stone-700 hover:bg-[#EAE2D4]'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* Content depending on view mode */}
        {viewMode === 'cards' ? (
          filteredExams.length === 0 ? (
            <div className="text-center py-16 bg-[#FAF8F5] border border-[#E5DFD3] rounded-2xl">
              <p className="text-stone-600 text-sm font-medium">
                No examination bodies matched your search &quot;{searchQuery}&quot;.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedState('All States & National');
                  setSelectedCategory('All');
                }}
                className="mt-3 text-xs font-semibold text-amber-800 underline cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredExams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} onNavigate={onNavigate} />
              ))}
            </div>
          )
        ) : (
          /* Dedicated Tools Grid View */
          filteredDedicatedTools.length === 0 ? (
            <div className="text-center py-16 bg-[#FAF8F5] border border-[#E5DFD3] rounded-2xl">
              <p className="text-stone-600 text-sm font-medium">
                No dedicated tools matched your search &quot;{searchQuery}&quot;.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedState('All States & National');
                }}
                className="mt-3 text-xs font-semibold text-amber-800 underline cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDedicatedTools.map((tool) => (
                <div
                  key={tool.id}
                  className="bg-[#FAF8F5] border border-[#E5DFD3] hover:border-amber-600/60 rounded-2xl p-4 sm:p-5 shadow-xs transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-semibold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                        {tool.state}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                        {tool.badge}
                      </span>
                    </div>

                    <div className="flex items-start gap-2.5 mt-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-[#F2ECE1] text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                        {tool.toolType === 'signature' ? (
                          <PenTool className="w-4 h-4 text-blue-700" />
                        ) : tool.toolType === 'thumb' ? (
                          <Fingerprint className="w-4 h-4 text-purple-700" />
                        ) : tool.toolType === 'declaration' ? (
                          <FileText className="w-4 h-4 text-emerald-700" />
                        ) : (
                          <Camera className="w-4 h-4 text-amber-700" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-sm text-stone-900 group-hover:text-amber-800 transition-colors leading-snug">
                          {tool.title}
                        </h3>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          {tool.spec.dimensionLabel || 'Prescribed aspect ratio'} • {tool.spec.format}
                        </p>
                      </div>
                    </div>
                  </div>

                  <a
                    href={`/tool/${tool.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(`/tool/${tool.slug}`);
                    }}
                    className="w-full py-2 px-3 text-xs font-semibold bg-[#EFE8DD] hover:bg-amber-600 hover:text-white text-stone-800 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                  >
                    <span>Open {tool.shortTitle}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          )
        )}
      </section>

      {/* Official Exam Specifications Comparison Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF8F5] border border-[#E5DFD3] rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-900">
                Official Standards Reference
              </span>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-stone-900">
                Top Indian Exams Specifications Matrix
              </h2>
            </div>
            <span className="text-xs text-stone-500 bg-[#EFE9DD] px-3 py-1.5 rounded-lg">
              Updated for 2026 Recruitment Notifications
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F2ECE1] text-stone-800 border-b border-[#E0D7C9]">
                  <th className="p-3 font-semibold">Exam Body</th>
                  <th className="p-3 font-semibold">Photo File Size</th>
                  <th className="p-3 font-semibold">Signature File Size</th>
                  <th className="p-3 font-semibold">Dimensions / Pixel Rules</th>
                  <th className="p-3 font-semibold">Special Mandate</th>
                  <th className="p-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE2D5] text-stone-700">
                {EXAM_BODIES.slice(0, 10).map((exam) => (
                  <tr key={exam.id} className="hover:bg-[#F7F2EB] transition-colors">
                    <td className="p-3 font-bold text-stone-900">
                      {exam.name}
                      <span className="block text-[10px] font-normal text-stone-500">{exam.state}</span>
                    </td>
                    <td className="p-3 font-semibold text-amber-900">
                      {exam.photo.minKB} KB - {exam.photo.maxKB} KB
                    </td>
                    <td className="p-3 font-semibold text-blue-900">
                      {exam.signature.minKB} KB - {exam.signature.maxKB} KB
                    </td>
                    <td className="p-3 text-stone-600">
                      {exam.photo.dimensionLabel || 'Standard 3.5x4.5cm'}
                    </td>
                    <td className="p-3 text-[11px] text-stone-600">
                      {exam.photo.requireNameDate ? (
                        <span className="inline-flex items-center gap-1 text-emerald-800 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Name & Date of Photo Required
                        </span>
                      ) : (
                        exam.photo.backgroundRule || 'Plain white background'
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <a
                        href={`/exam/${exam.slug}`}
                        onClick={(e) => {
                          e.preventDefault();
                          onNavigate(`/exam/${exam.slug}`);
                        }}
                        className="text-xs font-semibold text-amber-800 hover:text-amber-900 hover:underline cursor-pointer"
                      >
                        Resize Now →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 3 Step Visual Guide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-900">
            Effortless 3-Step Process
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 mt-1">
            How to Resize Documents for Indian Exams
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            No technical knowledge needed. Our browser tool handles resolution, aspect ratio, and binary compression.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#FAF8F5] border border-[#E5DFD3] rounded-2xl p-6 text-center shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 font-serif font-bold text-xl flex items-center justify-center mx-auto mb-4 border border-amber-200">
              1
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">
              Select Your Exam Body
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Choose UPSC, SSC, IBPS, NTA, or your specific state recruitment board. The required KB bounds and dimensions are pre-configured automatically.
            </p>
          </div>

          <div className="bg-[#FAF8F5] border border-[#E5DFD3] rounded-2xl p-6 text-center shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 font-serif font-bold text-xl flex items-center justify-center mx-auto mb-4 border border-amber-200">
              2
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">
              Upload Your File
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Drag and drop your passport photo, signature, or thumb impression. The client-side canvas engine compresses the file in under 0.5 second.
            </p>
          </div>

          <div className="bg-[#FAF8F5] border border-[#E5DFD3] rounded-2xl p-6 text-center shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 font-serif font-bold text-xl flex items-center justify-center mx-auto mb-4 border border-amber-200">
              3
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">
              Preview & Instant Download
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Check live side-by-side verification with portal compliance feedback. Click download to receive your portal-ready file.
            </p>
          </div>
        </div>
      </section>

      {/* About Image Compress Cloud Section (Required by User) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF8F5] border border-[#E5DFD3] rounded-2xl p-6 sm:p-10 shadow-xs space-y-5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-600"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-900">
              About Image Compress Cloud
            </span>
          </div>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900">
            Built for 30+ Million Indian Job Aspirants
          </h2>
          <p className="text-sm text-stone-700 leading-relaxed">
            <strong>Image Compress Cloud</strong> (<a href="https://image-compress.cloud" className="text-amber-800 underline">https://image-compress.cloud</a>) was created to solve one of the most frustrating bottlenecks in government exam registration: portal rejection due to minute file size and dimension errors. Most candidates in India access online application portals via mobile phones without access to specialized desktop graphic design software.
          </p>
          <p className="text-sm text-stone-700 leading-relaxed">
            By running full binary-search quantization directly inside the user&apos;s mobile or desktop browser via HTML5 Canvas, our tools achieve sub-second execution without sending sensitive biometrics, Aadhaar photographs, or signatures across the public internet. Every state examination agency—from UPPSC in Uttar Pradesh to BPSC in Bihar, RPSC in Rajasthan, Kerala PSC Thulasi, and OJAS Gujarat—is tracked and supported with dedicated, indexable, and pre-calibrated tools.
          </p>
          <div className="pt-2">
            <a
              href="/about"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/about');
              }}
              className="text-xs font-semibold text-amber-800 hover:text-amber-900 underline underline-offset-4 flex items-center gap-1 cursor-pointer"
            >
              Learn more about our architecture & team →
            </a>
          </div>
        </div>
      </section>

      {/* Blog & Educational Guides Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-900">
              Knowledge Base & Official Rules
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900">
              Latest Exam Application Guides
            </h2>
          </div>
          <a
            href="/blog"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/blog');
            }}
            className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
          >
            View All Guides <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BLOG_POSTS.slice(0, 2).map((post) => (
            <div
              key={post.id}
              className="bg-[#FAF8F5] border border-[#E6DFCD] hover:border-amber-600/50 rounded-2xl p-6 shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 text-xs text-stone-500 mb-2">
                  <span className="bg-amber-100 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full font-semibold">
                    {post.category}
                  </span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">
                  {post.title}
                </h3>
                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
                  {post.description}
                </p>
              </div>
              <a
                href={`/blog/${post.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(`/blog/${post.slug}`);
                }}
                className="text-xs font-semibold text-amber-800 hover:underline flex items-center gap-1 self-start cursor-pointer"
              >
                Read Guide →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-900">
            Frequently Asked Questions
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 mt-1">
            Got Questions About Exam Image Resizing?
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'How does Image Compress Cloud ensure my photo is within the exact KB limit?',
              a: 'Our engine uses an iterative binary-search quantization loop directly in your browser. It calculates the byte size of the JPEG compressed output and dynamically steps through quality values until the file lands precisely within the exam minKB and maxKB boundaries.',
            },
            {
              q: 'Are my uploaded photographs or signatures stored on your server?',
              a: 'No. Never. Image Compress Cloud operates 100% locally on your device using HTML5 Offscreen Canvas and Pica.js memory. No image files are ever uploaded, transmitted, or saved to any remote cloud server.',
            },
            {
              q: 'How do I add my Name and Date of Taking Photo (DOP)?',
              a: 'Toggle the "Print Candidate Name & Date of Photo (DOP)" option in the fine controls or use our dedicated Name & Date Tool. It generates a crisp white rectangular banner at the bottom with official government typography.',
            },
            {
              q: 'Why did the SSC or UPSC portal say "Signature must be in running handwriting"?',
              a: 'Recruiting commissions like SSC and IBPS explicitly disqualify applications where the candidate signs in capital (block) letters. Always sign with running handwriting on plain white paper with black ink.',
            },
            {
              q: 'Can I resize photos for state exams like BPSC, UPPSC, or OJAS Gujarat?',
              a: 'Yes! We have pre-calibrated profiles for all 28+ Indian states, including OJAS Gujarat ultra-strict 15 KB limit, Kerala PSC 150x200 px format, and DSSSB 5x7 postcard format.',
            },
          ].map((faq, idx) => (
            <details
              key={idx}
              className="group bg-[#FAF8F5] border border-[#E5DFD3] rounded-xl overflow-hidden transition-colors"
            >
              <summary className="w-full p-4 text-left font-serif font-bold text-stone-900 text-sm sm:text-base flex items-center justify-between gap-4 cursor-pointer list-none select-none">
                <span>{faq.q}</span>
                <ChevronDown className="w-4 h-4 text-stone-500 transition-transform group-open:rotate-180 shrink-0" />
              </summary>
              <div className="px-4 pb-4 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-[#EAE3D6] pt-3">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
};

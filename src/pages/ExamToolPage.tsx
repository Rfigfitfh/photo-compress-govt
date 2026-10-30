import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  PenTool, 
  Fingerprint, 
  FileText, 
  ExternalLink, 
  HelpCircle, 
  ChevronDown, 
  CheckCircle, 
  ArrowLeft 
} from 'lucide-react';
import { ExamBody, ToolType } from '../types';
import { ImageToolWorkspace } from '../components/ImageToolWorkspace';
import { updatePageSeo } from '../utils/seo';
import { DEDICATED_TOOLS } from '../data/dedicatedTools';

interface ExamToolPageProps {
  exam: ExamBody;
  onNavigate: (path: string) => void;
}

export const ExamToolPage: React.FC<ExamToolPageProps> = ({ exam, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<ToolType>('photo');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Dynamic FAQ list derived from exam specs and official guidelines
  const faqList = [
    {
      q: `What are the exact photo specifications for ${exam.name}?`,
      a: `For ${exam.name} (${exam.fullName}), candidate photographs must be in JPEG/JPG format, strictly sized between ${exam.photo.minKB} KB and ${exam.photo.maxKB} KB${exam.photo.exactWidth && exam.photo.exactHeight ? ` with dimensions ${exam.photo.exactWidth} x ${exam.photo.exactHeight} pixels` : exam.photo.aspectRatio ? ` with aspect ratio ${exam.photo.aspectRatio}` : ''}. The face must cover 70-80% of the image frame against a clean white or light background without caps or goggles.`,
    },
    {
      q: `What is the signature file size limit for ${exam.name} online portal?`,
      a: `Signatures for ${exam.name} must be uploaded as JPG/JPEG within ${exam.signature.minKB} KB to ${exam.signature.maxKB} KB${exam.signature.exactWidth && exam.signature.exactHeight ? ` (${exam.signature.exactWidth} x ${exam.signature.exactHeight} px)` : ''}. It should be signed clearly with dark blue or black ink on crisp white paper without smudging or shadows.`,
    },
    ...(exam.thumb ? [{
      q: `What is the thumb impression size required for ${exam.name}?`,
      a: `The Left Thumb Impression (LTI) for ${exam.name} must be between ${exam.thumb.minKB} KB and ${exam.thumb.maxKB} KB${exam.thumb.exactWidth && exam.thumb.exactHeight ? ` (${exam.thumb.exactWidth}x${exam.thumb.exactHeight} px)` : ''}. Clear ridge patterns must be visible with blue or black stamp ink.`,
    }] : []),
    {
      q: `Why does the ${exam.name} application portal reject my upload?`,
      a: `Recruitment servers run automated sanity checks. If your photo is even 1 KB under ${exam.photo.minKB} KB or over ${exam.photo.maxKB} KB, or if dimensions fail exact pixel boundaries, the server aborts submission. Our tool ensures exact byte padding and dimension alignment to guarantee instant acceptance.`,
    },
    {
      q: `Is my photograph and signature kept private and safe?`,
      a: `Yes, 100%. All image resizing, cropping, and compression run strictly inside your browser's local memory (RAM) using client-side HTML5 Canvas and Pica.js algorithms. No files are ever sent to external servers.`,
    },
  ];

  // Synchronize SEO on mount and when exam changes
  useEffect(() => {
    updatePageSeo({
      title: exam.seoTitle,
      description: exam.seoDescription,
      keywords: exam.seoKeywords,
      canonicalPath: `/exam/${exam.slug}`,
      structuredData: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            name: `${exam.name} Photo & Signature Resizer`,
            description: exam.seoDescription,
            url: `https://image-compress.cloud/exam/${exam.slug}`,
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
              {
                '@type': 'ListItem',
                position: 1,
                name: 'All Exams Directory',
                item: 'https://image-compress.cloud',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: exam.name,
                item: `https://image-compress.cloud/exam/${exam.slug}`,
              },
            ],
          },
          {
            '@type': 'FAQPage',
            mainEntity: faqList.map((item) => ({
              '@type': 'Question',
              name: item.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.a,
              },
            })),
          },
        ],
      },
    });
    window.scrollTo(0, 0);
  }, [exam]);

  // Determine current active spec
  const currentSpec =
    activeTab === 'photo'
      ? exam.photo
      : activeTab === 'signature'
      ? exam.signature
      : activeTab === 'thumb' && exam.thumb
      ? exam.thumb
      : exam.declaration || exam.photo;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Breadcrumb & Back */}
      <div className="flex items-center gap-2 text-xs text-stone-500 mb-6">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
          }}
          className="hover:text-stone-800 flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          All Exams Directory
        </a>
        <span>/</span>
        <span className="text-stone-400">{exam.state}</span>
        <span>/</span>
        <span className="text-stone-800 font-semibold">{exam.name}</span>
      </div>

      {/* Hero Header */}
      <div className="bg-[#FAF8F5] border border-[#E5DFD3] rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {exam.state}
              </span>
              <span className="text-xs text-stone-500 bg-[#EFE9DD] px-2 py-0.5 rounded font-medium">
                {exam.category}
              </span>
            </div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 leading-tight">
              {exam.name} Photo & Signature Resizer
            </h1>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">{exam.fullName}</p>
          </div>

          <a
            href={exam.officialWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#EFE8DD] hover:bg-[#E5DECF] text-stone-800 border border-[#DDD5C7] px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap self-start md:self-auto"
          >
            <span>Official Portal Link</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-[#EAE3D6]">
          <button
            onClick={() => setActiveTab('photo')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'photo'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-[#F2ECE1] text-stone-700 hover:bg-[#EAE2D4]'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Photograph Resizer ({exam.photo.minKB}-{exam.photo.maxKB} KB)</span>
          </button>

          <button
            onClick={() => setActiveTab('signature')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'signature'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-[#F2ECE1] text-stone-700 hover:bg-[#EAE2D4]'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>Signature Resizer ({exam.signature.minKB}-{exam.signature.maxKB} KB)</span>
          </button>

          {exam.thumb && (
            <button
              onClick={() => setActiveTab('thumb')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'thumb'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-[#F2ECE1] text-stone-700 hover:bg-[#EAE2D4]'
              }`}
            >
              <Fingerprint className="w-4 h-4" />
              <span>Thumb Impression ({exam.thumb.minKB}-{exam.thumb.maxKB} KB)</span>
            </button>
          )}

          {exam.declaration && (
            <button
              onClick={() => setActiveTab('declaration')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'declaration'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-[#F2ECE1] text-stone-700 hover:bg-[#EAE2D4]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Handwritten Declaration ({exam.declaration.minKB}-{exam.declaration.maxKB} KB)</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Tool Workspace */}
      <div className="mb-12">
        <ImageToolWorkspace
          key={`${exam.id}-${activeTab}`}
          toolType={activeTab}
          examName={exam.name}
          spec={currentSpec}
        />
      </div>

      {/* Dedicated In-Depth SEO Article for this Exam Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-[#FAF8F5] border border-[#E5DFD3] rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-stone-900">
            Official Guidelines for {exam.name} Photo & Signature Upload
          </h2>

          <p className="text-sm text-stone-700 leading-relaxed">
            {exam.articleContent.intro}
          </p>

          <div className="bg-[#F4EFE6] border border-[#E3DACD] rounded-xl p-5">
            <h3 className="font-semibold text-sm text-stone-900 mb-3 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-700" />
              Official Requirements Checklist:
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
              {exam.articleContent.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 shrink-0"></span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">
              Dimensions & Aspect Ratio Instructions
            </h3>
            <p className="text-sm text-stone-700 leading-relaxed">
              {exam.articleContent.dimensionsGuide}
            </p>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-3">
              Common Reasons for Rejection in {exam.name}
            </h3>
            <div className="space-y-2">
              {exam.articleContent.commonMistakes.map((mistake, idx) => (
                <div
                  key={idx}
                  className="bg-[#FBF8F3] border border-[#EBE3D7] rounded-lg p-3 text-xs sm:text-sm text-stone-700 flex items-start gap-2.5"
                >
                  <span className="text-red-600 font-bold">✕</span>
                  <span>{mistake}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Official Frequently Asked Questions */}
          <div className="space-y-4 pt-6 border-t border-[#EAE3D6]">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-700" />
              <h3 className="font-serif font-bold text-xl text-stone-900">
                Frequently Asked Questions ({exam.name})
              </h3>
            </div>
            <div className="space-y-3">
              {faqList.map((item, idx) => (
                <details
                  key={idx}
                  open={openFaq === idx}
                  onToggle={(e) => {
                    if ((e.target as HTMLDetailsElement).open) {
                      setOpenFaq(idx);
                    } else if (openFaq === idx) {
                      setOpenFaq(null);
                    }
                  }}
                  className="group bg-[#FAF8F5] border border-[#E5DFD3] rounded-xl overflow-hidden transition-all shadow-2xs"
                >
                  <summary className="w-full p-4 font-serif font-bold text-stone-900 text-sm sm:text-base flex items-center justify-between cursor-pointer select-none hover:bg-[#F4EFE6]/50 transition-colors list-none">
                    <span>{item.q}</span>
                    <ChevronDown className="w-4 h-4 text-stone-500 group-open:rotate-180 transition-transform duration-200 shrink-0 ml-2" />
                  </summary>
                  <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-stone-700 leading-relaxed border-t border-[#EFE9DE]/50">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Quick Spec Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#F5EFE6] border border-[#E2DAD0] rounded-2xl p-6">
            <h3 className="font-serif font-bold text-base text-stone-900 mb-4">
              Quick Reference Cheat Sheet
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-[#E7DFD3]">
                <span className="text-stone-600 font-medium">Exam Agency:</span>
                <span className="font-bold text-stone-900 text-right">{exam.fullName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#E7DFD3]">
                <span className="text-stone-600 font-medium">Jurisdiction:</span>
                <span className="font-bold text-stone-900">{exam.state}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#E7DFD3]">
                <span className="text-stone-600 font-medium">Photo KB Range:</span>
                <span className="font-bold text-amber-800">
                  {exam.photo.minKB} KB - {exam.photo.maxKB} KB
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#E7DFD3]">
                <span className="text-stone-600 font-medium">Signature KB:</span>
                <span className="font-bold text-blue-800">
                  {exam.signature.minKB} KB - {exam.signature.maxKB} KB
                </span>
              </div>
              {exam.thumb && (
                <div className="flex justify-between py-2 border-b border-[#E7DFD3]">
                  <span className="text-stone-600 font-medium">Thumb Impression:</span>
                  <span className="font-bold text-purple-800">
                    {exam.thumb.minKB} KB - {exam.thumb.maxKB} KB
                  </span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-[#E7DFD3]">
                <span className="text-stone-600 font-medium">Format:</span>
                <span className="font-bold text-stone-900">JPEG / JPG</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-stone-600 font-medium">Browser Processing:</span>
                <span className="font-bold text-emerald-700">&lt; 0.5 Second</span>
              </div>
            </div>

            {/* Dedicated Tools Links for Search Crawlers & User Navigation */}
            {DEDICATED_TOOLS.filter((t) => t.examId === exam.id).length > 0 && (
              <div className="pt-4 mt-4 border-t border-[#E7DFD3] space-y-2">
                <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-stone-700">
                  Dedicated {exam.name} Tools
                </h4>
                <div className="flex flex-col gap-1.5">
                  {DEDICATED_TOOLS.filter((t) => t.examId === exam.id).map((t) => (
                    <a
                      key={t.id}
                      href={`/tool/${t.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(`/tool/${t.slug}`);
                      }}
                      className="text-xs text-amber-900 hover:text-amber-950 hover:underline flex items-center justify-between bg-[#ECE4D6] px-2.5 py-1.5 rounded-lg border border-[#DDD3C2] transition-colors"
                    >
                      <span className="font-medium">{t.shortTitle}</span>
                      <span className="text-[10px] text-stone-600 font-semibold">{t.badge} →</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Privacy Note */}
          <div className="bg-[#FAF8F5] border border-[#E5DFD3] rounded-2xl p-5 text-xs text-stone-600 space-y-2">
            <h4 className="font-semibold text-stone-900 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              100% Client-Side Privacy
            </h4>
            <p>
              Your candidate documents are processed using in-memory HTML5 Canvas buffers on your phone or computer. No images ever leave your browser.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect } from 'react';
import { 
  Camera, 
  PenTool, 
  Fingerprint, 
  FileText, 
  CheckCircle, 
  ArrowLeft, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  HelpCircle,
  FileCheck,
  AlertTriangle
} from 'lucide-react';
import { DedicatedTool } from '../types';
import { ImageToolWorkspace } from '../components/ImageToolWorkspace';
import { updatePageSeo } from '../utils/seo';
import { DEDICATED_TOOLS } from '../data/dedicatedTools';
import { EXAM_BODIES } from '../data/examBodies';

interface DedicatedToolPageProps {
  tool: DedicatedTool;
  onNavigate: (path: string) => void;
}

export const DedicatedToolPage: React.FC<DedicatedToolPageProps> = ({ tool, onNavigate }) => {
  // Sibling tools for the same exam body
  const siblingTools = DEDICATED_TOOLS.filter(
    (t) => t.examId === tool.examId && t.id !== tool.id
  );

  const parentExam = EXAM_BODIES.find((e) => e.id === tool.examId);
  const examHubPath = parentExam ? `/exam/${parentExam.slug}` : `/exam/${tool.examId}`;

  useEffect(() => {
    window.scrollTo(0, 0);
    updatePageSeo({
      title: tool.seoTitle,
      description: tool.seoDescription,
      keywords: tool.seoKeywords,
      canonicalPath: `/tool/${tool.slug}`,
      structuredData: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            name: tool.title,
            description: tool.seoDescription,
            url: `https://image-compress.cloud/tool/${tool.slug}`,
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
                name: tool.examName,
                item: `https://image-compress.cloud${examHubPath}`,
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: tool.shortTitle,
                item: `https://image-compress.cloud/tool/${tool.slug}`,
              },
            ],
          },
        ],
      },
    });
  }, [tool, examHubPath]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Breadcrumb Navigation */}
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
          All Exam Tools
        </a>
        <span>/</span>
        <span className="text-stone-400">{tool.state}</span>
        <span>/</span>
        <a
          href={examHubPath}
          onClick={(e) => {
            e.preventDefault();
            onNavigate(examHubPath);
          }}
          className="text-stone-600 hover:text-stone-900 underline underline-offset-2"
        >
          {tool.examName}
        </a>
        <span>/</span>
        <span className="text-stone-800 font-semibold">{tool.shortTitle}</span>
      </div>

      {/* Header Banner */}
      <div className="bg-[#FAF8F5] border border-[#E5DFD3] rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {tool.state}
              </span>
              <span className="bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                Target: {tool.badge}
              </span>
              <span className="text-xs text-stone-500 bg-[#EFE9DD] px-2 py-0.5 rounded font-medium capitalize">
                {tool.toolType}
              </span>
            </div>

            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 leading-tight">
              {tool.title}
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
              Official online dedicated tool for <strong>{tool.examName}</strong>. Automatically compresses and resizes directly in your browser to meet strict portal scrutiny.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <a
              href={examHubPath}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(examHubPath);
              }}
              className="text-xs font-semibold bg-[#EAE2D4] hover:bg-[#DDD3C2] text-stone-800 border border-[#CFC3B0] px-3.5 py-2.5 rounded-xl transition-colors inline-block"
            >
              All {tool.examName} Tools
            </a>
          </div>
        </div>

        {/* Quick Sibling Tool Switcher */}
        {siblingTools.length > 0 && (
          <div className="mt-5 pt-4 border-t border-[#EAE3D6] flex flex-wrap items-center gap-2 text-xs">
            <span className="text-stone-500 font-medium mr-1">Other {tool.examName} Tools:</span>
            {siblingTools.map((st) => (
              <a
                key={st.id}
                href={`/tool/${st.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(`/tool/${st.slug}`);
                }}
                className="bg-[#F2ECE1] hover:bg-[#EAE2D4] text-stone-800 font-medium px-3 py-1.5 rounded-lg border border-[#DDD5C7] transition-colors flex items-center gap-1.5"
              >
                {st.toolType === 'signature' ? (
                  <PenTool className="w-3.5 h-3.5 text-blue-700" />
                ) : st.toolType === 'thumb' ? (
                  <Fingerprint className="w-3.5 h-3.5 text-purple-700" />
                ) : st.toolType === 'declaration' ? (
                  <FileText className="w-3.5 h-3.5 text-emerald-700" />
                ) : (
                  <Camera className="w-3.5 h-3.5 text-amber-700" />
                )}
                <span>{st.shortTitle}</span>
                <span className="text-[10px] text-stone-500">({st.badge})</span>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Main Interactive Tool Workspace */}
      <div className="mb-10">
        <ImageToolWorkspace
          key={tool.id}
          toolType={tool.toolType}
          examName={tool.examName}
          spec={tool.spec}
        />
      </div>

      {/* In-Depth Dedicated Technical Article */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-[#FAF8F5] border border-[#E5DFD3] rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-stone-900">
            {tool.article.heading}
          </h2>

          <div className="bg-[#F4EFE6] border border-[#E2DAD0] rounded-xl p-5 space-y-3">
            <h3 className="font-semibold text-sm text-stone-900 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-700" />
              Step-by-Step Upload Guidelines:
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
              {tool.article.instructions.map((inst, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 shrink-0"></span>
                  <span>{inst}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Portal Warning Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-950 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Important Notice from Official Bulletin: </strong>
              {tool.article.portalWarning}
            </div>
          </div>

          {/* How This Tool Guarantees Acceptance */}
          <div className="space-y-2">
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Why Use This Dedicated {tool.shortTitle}?
            </h3>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              Unlike generic photo resizers, this dedicated tool is hard-coded with the exact boundaries of {tool.examName}. If you resize a {tool.toolType}, our engine automatically checks both minimum and maximum byte boundaries ({tool.spec.minKB} KB - {tool.spec.maxKB} KB) and ensures dimensions like {tool.spec.dimensionLabel || 'official ratio'} match portal scrutiny. All image calculations run directly in your browser memory via HTML5 Canvas—nothing is sent over the network.
            </p>
          </div>
        </div>

        {/* Specifications Table Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#F5EFE6] border border-[#E2DAD0] rounded-2xl p-6">
            <h3 className="font-serif font-bold text-base text-stone-900 mb-4 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-amber-700" />
              Official Specs Sheet
            </h3>

            <div className="space-y-2.5 text-xs">
              {tool.article.specsTable.map((row, idx) => (
                <div key={idx} className="flex justify-between py-1.5 border-b border-[#E7DFD3] last:border-0">
                  <span className="text-stone-600 font-medium">{row.label}:</span>
                  <span className="font-bold text-stone-900 text-right">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#FAF8F5] border border-[#E5DFD3] rounded-2xl p-5 text-xs text-stone-600 space-y-2">
            <h4 className="font-semibold text-stone-900 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% Biometric Privacy Guarantee
            </h4>
            <p>
              Your personal photographs and signatures are processed exclusively in your device RAM. No images ever touch our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Camera, PenTool, Fingerprint, ArrowRight, ExternalLink } from 'lucide-react';
import { ExamBody } from '../types';

interface ExamCardProps {
  exam: ExamBody;
  onNavigate: (path: string) => void;
}

export const ExamCard: React.FC<ExamCardProps> = ({ exam, onNavigate }) => {
  return (
    <div className="bg-[#FAF8F5] border border-[#E6DFCD] hover:border-amber-600/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* State / Category Badge */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-semibold text-amber-900 bg-amber-100/80 border border-amber-200/80 px-2.5 py-0.5 rounded-full">
            {exam.state}
          </span>
          <span className="text-[11px] font-medium text-stone-500 bg-[#EFE9DD] px-2 py-0.5 rounded">
            {exam.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-amber-800 transition-colors leading-snug">
          {exam.name}
        </h3>
        <p className="text-xs text-stone-500 line-clamp-1 mb-4">{exam.fullName}</p>

        {/* Dedicated Tool Buttons directly on the card */}
        <div className="space-y-2 mb-5">
          <a
            href={`/tool/${exam.id}-photo-resize`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(`/tool/${exam.id}-photo-resize`);
            }}
            className="w-full flex items-center justify-between text-xs bg-[#F4EFE6] hover:bg-[#EAE2D4] px-3 py-2 rounded-lg border border-[#EAE2D5] transition-colors cursor-pointer text-left"
          >
            <span className="flex items-center gap-1.5 text-stone-800 font-medium">
              <Camera className="w-3.5 h-3.5 text-amber-700" />
              Photo Tool
            </span>
            <span className="font-bold text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded border border-amber-200/60">
              {exam.photo.minKB}-{exam.photo.maxKB} KB →
            </span>
          </a>

          <a
            href={`/tool/${exam.id}-signature-resize`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(`/tool/${exam.id}-signature-resize`);
            }}
            className="w-full flex items-center justify-between text-xs bg-[#F4EFE6] hover:bg-[#EAE2D4] px-3 py-2 rounded-lg border border-[#EAE2D5] transition-colors cursor-pointer text-left"
          >
            <span className="flex items-center gap-1.5 text-stone-800 font-medium">
              <PenTool className="w-3.5 h-3.5 text-blue-700" />
              Signature Tool (Anti-Blur)
            </span>
            <span className="font-bold text-blue-900 bg-blue-100/70 px-2 py-0.5 rounded border border-blue-200/60">
              {exam.signature.minKB}-{exam.signature.maxKB} KB →
            </span>
          </a>

          {exam.thumb && (
            <a
              href={`/tool/${exam.id}-thumb-impression-resize`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(`/tool/${exam.id}-thumb-impression-resize`);
              }}
              className="w-full flex items-center justify-between text-xs bg-[#F4EFE6] hover:bg-[#EAE2D4] px-3 py-2 rounded-lg border border-[#EAE2D5] transition-colors cursor-pointer text-left"
            >
              <span className="flex items-center gap-1.5 text-stone-800 font-medium">
                <Fingerprint className="w-3.5 h-3.5 text-purple-700" />
                Thumb Tool (200 DPI)
              </span>
              <span className="font-bold text-purple-900 bg-purple-100/70 px-2 py-0.5 rounded border border-purple-200/60">
                {exam.thumb.minKB}-{exam.thumb.maxKB} KB →
              </span>
            </a>
          )}
        </div>
      </div>

      {/* Action CTA for Full Hub */}
      <div className="pt-3 border-t border-[#EFE8DC] flex items-center justify-between gap-2">
        <a
          href={`/exam/${exam.slug}`}
          onClick={(e) => {
            e.preventDefault();
            onNavigate(`/exam/${exam.slug}`);
          }}
          className="w-full text-xs font-semibold py-2 px-3 text-stone-700 hover:text-stone-900 hover:bg-[#EFE8DD] rounded-lg transition-colors flex items-center justify-center gap-1"
        >
          <span>Official Notification & Guidelines</span>
          <ArrowRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

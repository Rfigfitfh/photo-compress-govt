import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  RefreshCw, 
  Sliders, 
  Calendar, 
  User, 
  Eye, 
  FileCheck,
  Zap,
  Info
} from 'lucide-react';
import { ExamSpecItem, ToolType, CompressionResult } from '../types';
import { compressImage, generateSampleCanvas } from '../utils/canvasCompressor';
import { formatFileSize } from '../utils/imageMath';

interface ImageToolWorkspaceProps {
  toolType: ToolType;
  examName?: string;
  spec: ExamSpecItem;
  defaultCandidateName?: string;
}

export const ImageToolWorkspace: React.FC<ImageToolWorkspaceProps> = ({
  toolType,
  examName = 'Universal',
  spec,
  defaultCandidateName = 'RAHUL SHARMA',
}) => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [originalStats, setOriginalStats] = useState<{
    width: number;
    height: number;
    sizeKB: number;
    name: string;
  } | null>(null);

  // Tool settings pre-calibrated to exam spec
  const defaultTargetKB = Math.round((spec.minKB + spec.maxKB) / 2);
  const isSig = toolType === 'signature';
  const isThm = toolType === 'thumb';
  const isDec = toolType === 'declaration';
  const defaultW = spec.exactWidth || spec.minWidth || (isSig ? 300 : isThm ? 300 : isDec ? 800 : 350);
  const defaultH = spec.exactHeight || spec.minHeight || (isSig ? 120 : isThm ? 300 : isDec ? 400 : 450);

  const [targetKB, setTargetKB] = useState<number>(defaultTargetKB);
  const [customWidth, setCustomWidth] = useState<number>(defaultW);
  const [customHeight, setCustomHeight] = useState<number>(defaultH);
  const [lockAspect, setLockAspect] = useState<boolean>(
    !spec.exactWidth && !spec.exactHeight && !spec.minWidth && !spec.minHeight
  );
  
  // Stamped watermark: always true for namedate tool, or if specified by exam
  const [addNameDate, setAddNameDate] = useState<boolean>(toolType === 'namedate' || !!spec.requireNameDate);
  const [candidateName, setCandidateName] = useState<string>(defaultCandidateName);
  const [dateOfPhoto, setDateOfPhoto] = useState<string>(() => {
    const today = new Date();
    const d = String(today.getDate()).padStart(2, '0');
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const y = today.getFullYear();
    return `${d}-${m}-${y}`;
  });

  // Paper clean-up filters
  const [cleanSignature, setCleanSignature] = useState<boolean>(toolType === 'signature');
  const [cleanThumb, setCleanThumb] = useState<boolean>(toolType === 'thumb');
  const [inkBoost, setInkBoost] = useState<number>(2); // 1 = Normal, 2 = Enhanced Sharp (anti-blur), 3 = Bold

  // Processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(toolType === 'namedate');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevDataUrlRef = useRef<string | null>(null);

  // Revoke previous object URL on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (prevDataUrlRef.current) {
        URL.revokeObjectURL(prevDataUrlRef.current);
        prevDataUrlRef.current = null;
      }
    };
  }, []);

  // Sync state cleanly when spec or toolType changes
  useEffect(() => {
    const avgKB = Math.round((spec.minKB + spec.maxKB) / 2);
    setTargetKB(avgKB);
    const sig = toolType === 'signature';
    const thm = toolType === 'thumb';
    const dec = toolType === 'declaration';
    const nextW = spec.exactWidth || spec.minWidth || (sig ? 300 : thm ? 300 : dec ? 800 : 350);
    const nextH = spec.exactHeight || spec.minHeight || (sig ? 120 : thm ? 300 : dec ? 400 : 450);
    setCustomWidth(nextW);
    setCustomHeight(nextH);
    setLockAspect(!spec.exactWidth && !spec.exactHeight && !spec.minWidth && !spec.minHeight);
    setAddNameDate(toolType === 'namedate' || !!spec.requireNameDate);
    if (toolType === 'signature') {
      setCleanSignature(true);
      setInkBoost(2);
    } else {
      setCleanSignature(false);
    }
    if (toolType === 'thumb') {
      setCleanThumb(true);
    } else {
      setCleanThumb(false);
    }
    if (toolType === 'namedate') {
      setShowAdvanced(true);
    }
  }, [spec, toolType]);

  // Run compression whenever source or parameters change
  const runCompression = async (imgSrc: string, boostVal = inkBoost) => {
    setIsProcessing(true);
    try {
      const isNameDateActive = addNameDate && (toolType === 'photo' || toolType === 'namedate');
      const res = await compressImage(imgSrc, {
        targetKB,
        minKB: spec.minKB,
        maxKB: spec.maxKB,
        targetWidth: customWidth,
        targetHeight: customHeight,
        minWidth: spec.minWidth,
        minHeight: spec.minHeight,
        maxWidth: spec.maxWidth,
        maxHeight: spec.maxHeight,
        exactWidth: spec.exactWidth,
        exactHeight: spec.exactHeight,
        lockAspectRatio: lockAspect,
        format: spec.format === 'PNG' ? 'image/png' : 'image/jpeg',
        dpi: spec.dpi || 200,
        addNameDate: isNameDateActive,
        candidateName,
        dateOfPhoto,
        cleanSignature: cleanSignature && toolType === 'signature',
        cleanThumb: cleanThumb && toolType === 'thumb',
        isSignature: toolType === 'signature',
        isDeclaration: toolType === 'declaration',
        inkBoost: boostVal,
      });

      // Free previous blob URL to prevent memory leaks
      if (prevDataUrlRef.current && prevDataUrlRef.current !== res.dataUrl) {
        URL.revokeObjectURL(prevDataUrlRef.current);
      }
      prevDataUrlRef.current = res.dataUrl;

      setResult(res);
    } catch (err) {
      console.error('Compression failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Recompress reactively when checkboxes, toggles, or fine controls change without stale closures
  useEffect(() => {
    if (sourceImage) {
      runCompression(sourceImage);
    }
  }, [cleanSignature, cleanThumb, addNameDate, inkBoost, lockAspect, targetKB, customWidth, customHeight]);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid JPG, PNG or WEBP image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setOriginalStats({
          width: img.naturalWidth,
          height: img.naturalHeight,
          sizeKB: Math.round((file.size / 1024) * 10) / 10,
          name: file.name,
        });
        setSourceImage(dataUrl);
        runCompression(dataUrl);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // 1-Click Sample Generator
  const handleLoadSample = () => {
    const sampleType =
      toolType === 'signature'
        ? 'signature'
        : toolType === 'thumb'
        ? 'thumb'
        : toolType === 'declaration'
        ? 'declaration'
        : 'photo';
    const sampleDataUrl = generateSampleCanvas(sampleType, candidateName, dateOfPhoto);
    setOriginalStats({
      width: sampleType === 'declaration' ? 800 : sampleType === 'signature' ? 400 : sampleType === 'thumb' ? 300 : 400,
      height: sampleType === 'declaration' ? 400 : sampleType === 'signature' ? 150 : sampleType === 'thumb' ? 300 : 500,
      sizeKB: sampleType === 'declaration' ? 145.2 : 245.5,
      name: `Sample_${sampleType}.jpg`,
    });
    setSourceImage(sampleDataUrl);
    runCompression(sampleDataUrl);
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.dataUrl;
    const cleanExam = examName.replace(/[^a-zA-Z0-9]/g, '_');
    const ext = result.format.toLowerCase();
    a.download = `${cleanExam}_${toolType}_${result.sizeKB}KB_${result.width}x${result.height}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Re-compress when controls are changed
  const triggerRecompress = () => {
    if (sourceImage) {
      runCompression(sourceImage);
    }
  };

  return (
    <div className="bg-[#FAF8F5] border border-[#E5DFD3] rounded-2xl p-4 sm:p-6 shadow-sm">
      {/* Spec Guidance Header */}
      <div className="bg-[#F4EFE6] border border-[#E2DAD0] rounded-xl p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-900 text-base">
              {examName} {toolType.toUpperCase()} Specifications
            </span>
            <span className="bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Target: {spec.minKB} KB - {spec.maxKB} KB
            </span>
          </div>
          <p className="text-xs text-stone-600 mt-1">
            {spec.dimensionLabel || 'Prescribed aspect ratio'} • {spec.format} • {spec.notes}
          </p>
        </div>

        {/* 1-Click Sample Button */}
        <button
          onClick={handleLoadSample}
          className="inline-flex items-center gap-1.5 text-xs font-medium bg-[#EAE2D4] hover:bg-[#DDD3C2] text-stone-800 border border-[#CFC3B0] px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap self-start md:self-auto cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-700" />
          Try Sample {toolType === 'signature' ? 'Signature' : toolType === 'thumb' ? 'Thumb' : toolType === 'declaration' ? 'Declaration' : 'Photo'}
        </button>
      </div>

      {/* Main Workspace Layout */}
      {!sourceImage ? (
        /* Empty Upload Dropzone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileUpload(e.dataTransfer.files[0]);
            }
          }}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-14 text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-amber-600 bg-amber-50/50 scale-[0.99]'
              : 'border-[#D4CBBF] hover:border-amber-600/70 bg-[#FBF9F6] hover:bg-[#F7F2EB]'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
            accept="image/jpeg,image/png,image/webp,image/jpg"
            className="hidden"
          />

          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 mx-auto flex items-center justify-center mb-4 border border-amber-200 shadow-sm">
            <Upload className="w-8 h-8" />
          </div>

          <h3 className="font-serif font-bold text-xl text-stone-900 mb-1">
            Upload your {toolType === 'signature' ? 'Signature' : toolType === 'thumb' ? 'Thumb Impression' : 'Photograph'}
          </h3>
          <p className="text-sm text-stone-600 max-w-md mx-auto mb-4">
            Drag and drop your file here, or click to browse. Automatically resizes to <strong>{spec.minKB} KB - {spec.maxKB} KB</strong> without quality loss.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-stone-500">
            <span className="bg-[#EEE8DD] px-2.5 py-1 rounded border border-[#DFD7CA]">Supports JPG, PNG, WEBP</span>
            <span className="bg-[#EEE8DD] px-2.5 py-1 rounded border border-[#DFD7CA]">100% Client-Side Private</span>
            <span className="bg-[#EEE8DD] px-2.5 py-1 rounded border border-[#DFD7CA]">Takes &lt; 0.5s</span>
          </div>
        </div>
      ) : (
        /* Active Preview & Controls Grid */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Original Preview */}
            <div className="lg:col-span-5 bg-[#F5EFE6] border border-[#E0D7C9] rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-stone-500" />
                  Original Image
                </span>
                {originalStats && (
                  <span className="text-xs font-medium text-stone-500 bg-[#E8E0D2] px-2 py-0.5 rounded">
                    {originalStats.sizeKB} KB • {originalStats.width}×{originalStats.height}px
                  </span>
                )}
              </div>

              <div className="aspect-[4/3] bg-stone-100 rounded-lg overflow-hidden flex items-center justify-center border border-[#DDD5C7] relative">
                <img
                  src={sourceImage}
                  alt="Original candidate upload"
                  className="max-h-full max-w-full object-contain p-2"
                />
              </div>

              <div className="mt-3 flex items-center justify-between">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-medium text-amber-800 hover:text-amber-900 underline underline-offset-2 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Upload Different Photo
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  className="hidden"
                />
              </div>
            </div>

            {/* Right: Compressed Preview + Validation */}
            <div className="lg:col-span-7 bg-[#FFFFFF] border-2 border-[#D8CEBF] rounded-xl p-4 sm:p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-600" />
                    Compressed & Resized Result
                  </span>
                  {result && (
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        result.passesSpec
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {result.passesSpec ? (
                        <>
                          <CheckCircle className="w-3 h-3" /> Portal Ready
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3" /> Adjust KB
                        </>
                      )}
                    </span>
                  )}
                </div>

                {result && (
                  <span className="text-xs font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                    {result.sizeKB} KB ({result.width}×{result.height}px)
                  </span>
                )}
              </div>

              {/* Compressed Image Canvas Preview */}
              <div className="aspect-[4/3] bg-[#FAF8F5] rounded-lg overflow-hidden flex items-center justify-center border border-[#DDD5C7] relative">
                {isProcessing ? (
                  <div className="flex flex-col items-center gap-2 text-stone-500">
                    <RefreshCw className="w-6 h-6 animate-spin text-amber-600" />
                    <span className="text-xs font-medium">Compressing in browser...</span>
                  </div>
                ) : result ? (
                  <img
                    src={result.dataUrl}
                    alt="Processed and resized candidate document"
                    className="max-h-full max-w-full object-contain p-2"
                  />
                ) : null}
              </div>

              {/* Validation Status Box */}
              {result && (
                <div
                  className={`mt-3 p-3 rounded-lg text-xs flex items-start gap-2 border ${
                    result.passesSpec
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                      : 'bg-amber-50/70 border-amber-200 text-amber-900'
                  }`}
                >
                  <FileCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-700" />
                  <div>
                    <strong className="font-semibold">Portal Compliance Status: </strong>
                    {result.specFeedback}
                  </div>
                </div>
              )}

              {/* Download & Actions Bar */}
              <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleDownload}
                  disabled={!result || isProcessing}
                  className="w-full sm:flex-1 py-3 px-4 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  Download Compressed {toolType.toUpperCase()} ({result ? `${result.sizeKB} KB` : ''})
                </button>

                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full sm:w-auto px-4 py-3 bg-[#EFE8DD] hover:bg-[#E5DECF] text-stone-800 text-xs font-medium rounded-xl border border-[#D5CABE] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  {showAdvanced ? 'Hide Fine Controls' : 'Fine Tune (KB / DOP)'}
                </button>
              </div>
            </div>
          </div>

          {/* Advanced / Custom Controls Drawer */}
          {showAdvanced && (
            <div className="bg-[#F6F1E8] border border-[#DDD5C7] rounded-xl p-5 space-y-5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-[#E2DAD0] pb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-amber-700" />
                  Custom Precision Controls
                </h4>
                <button
                  onClick={() => {
                    setTargetKB(defaultTargetKB);
                    const sig = toolType === 'signature';
                    const thm = toolType === 'thumb';
                    const dec = toolType === 'declaration';
                    const nextW = spec.exactWidth || spec.minWidth || (sig ? 300 : thm ? 300 : dec ? 800 : 350);
                    const nextH = spec.exactHeight || spec.minHeight || (sig ? 120 : thm ? 300 : dec ? 400 : 450);
                    setCustomWidth(nextW);
                    setCustomHeight(nextH);
                    setLockAspect(!spec.exactWidth && !spec.exactHeight && !spec.minWidth && !spec.minHeight);
                    setAddNameDate(toolType === 'namedate' || !!spec.requireNameDate);
                    setCleanSignature(toolType === 'signature');
                    setCleanThumb(toolType === 'thumb');
                    setInkBoost(2);
                  }}
                  className="text-xs text-amber-800 hover:underline cursor-pointer"
                >
                  Reset to Exam Defaults
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Target File Size Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-stone-700">
                      Target File Size (KB)
                    </label>
                    <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                      {targetKB} KB
                    </span>
                  </div>
                  <input
                    type="range"
                    min={Math.max(5, spec.minKB - 5)}
                    max={Math.min(500, spec.maxKB + 20)}
                    value={targetKB}
                    onChange={(e) => setTargetKB(Number(e.target.value))}
                    onMouseUp={triggerRecompress}
                    onTouchEnd={triggerRecompress}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-500 mt-0.5">
                    <span>Min: {spec.minKB} KB</span>
                    <span className="font-semibold text-stone-700">Exam Range</span>
                    <span>Max: {spec.maxKB} KB</span>
                  </div>
                </div>

                {/* Dimensions width/height */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-stone-700">
                      Resolution (Width × Height px)
                    </label>
                    <label className="text-[11px] text-stone-500 flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={lockAspect}
                        onChange={(e) => setLockAspect(e.target.checked)}
                        className="rounded text-amber-600 focus:ring-0"
                      />
                      Lock Ratio
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(Number(e.target.value))}
                      onBlur={triggerRecompress}
                      className="w-full text-xs font-medium bg-white border border-[#DDD5C7] rounded-lg px-2.5 py-1.5 text-stone-800 focus:outline-none focus:border-amber-600"
                      placeholder="Width"
                    />
                    <span className="text-xs text-stone-400">×</span>
                    <input
                      type="number"
                      value={customHeight}
                      onChange={(e) => setCustomHeight(Number(e.target.value))}
                      onBlur={triggerRecompress}
                      className="w-full text-xs font-medium bg-white border border-[#DDD5C7] rounded-lg px-2.5 py-1.5 text-stone-800 focus:outline-none focus:border-amber-600"
                      placeholder="Height"
                    />
                  </div>
                </div>

                {/* Exam Specific Enhancers */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-stone-700 block">
                    Special Document Filters
                  </label>

                  {toolType === 'signature' && (
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={cleanSignature}
                          onChange={(e) => setCleanSignature(e.target.checked)}
                          className="rounded text-amber-600 cursor-pointer"
                        />
                        <span className="font-semibold text-amber-900">Anti-Blur & Whiten Paper</span>
                      </label>

                      {cleanSignature && (
                        <div className="bg-[#FFFFFF] border border-[#DDD5C7] rounded-lg p-2.5 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-stone-800 block">
                              Pica.js Signature Pipeline:
                            </span>
                            <span className="text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded">
                              Pica.js Active
                            </span>
                          </div>
                          <div className="text-[10px] text-stone-600 bg-[#FAF7F2] p-1.5 rounded border border-[#ECE5D8] space-y-0.5">
                            <div>• <strong>Stage 1:</strong> Pica.js Lanczos3 High-Fidelity Resampling</div>
                            <div>• <strong>Stage 2:</strong> Pica Unsharp Mask Filter (Anti-Blur)</div>
                            <div>• <strong>Stage 3:</strong> Luminance Ink & Paper Whitener</div>
                          </div>
                          <div className="grid grid-cols-3 gap-1 text-[11px]">
                            {[
                              { label: 'Natural Ink', val: 1 },
                              { label: 'Crisp Sharp', val: 2 },
                              { label: 'Deep Contrast', val: 3 },
                            ].map((opt) => (
                              <button
                                key={opt.val}
                                type="button"
                                onClick={() => setInkBoost(opt.val)}
                                className={`py-1 px-1.5 rounded font-medium text-center transition-all cursor-pointer ${
                                  inkBoost === opt.val
                                    ? 'bg-amber-600 text-white font-semibold shadow-xs'
                                    : 'bg-[#F4EFE6] text-stone-700 hover:bg-[#EAE2D4]'
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                          <p className="text-[10px] text-stone-500 italic">
                            Pica.js Lanczos3 filter preserves delicate pen strokes and eliminates blurriness on 140×60 px exam signatures.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {toolType === 'thumb' && (
                    <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cleanThumb}
                        onChange={(e) => setCleanThumb(e.target.checked)}
                        className="rounded text-amber-600 cursor-pointer"
                      />
                      <span>Sharpen Thumb Ridge Lines</span>
                    </label>
                  )}

                  {(toolType === 'photo' || toolType === 'namedate') && (
                    <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={addNameDate}
                        onChange={(e) => setAddNameDate(e.target.checked)}
                        className="rounded text-amber-600 cursor-pointer"
                      />
                      <span>Print Candidate Name & Date of Photo (DOP)</span>
                    </label>
                  )}
                </div>
              </div>

              {/* Name & Date Inputs if Enabled */}
              {addNameDate && (toolType === 'photo' || toolType === 'namedate') && (
                <div className="pt-3 border-t border-[#E2DAD0] grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 flex items-center gap-1 mb-1">
                      <User className="w-3.5 h-3.5 text-stone-500" />
                      Candidate Full Name (in CAPITAL letters)
                    </label>
                    <input
                      type="text"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value.toUpperCase())}
                      onBlur={triggerRecompress}
                      placeholder="e.g. AMIT KUMAR"
                      className="w-full text-xs font-semibold bg-white border border-[#DDD5C7] rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-amber-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-700 flex items-center gap-1 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-stone-500" />
                      Date of Photograph (DOP: DD-MM-YYYY)
                    </label>
                    <input
                      type="text"
                      value={dateOfPhoto}
                      onChange={(e) => setDateOfPhoto(e.target.value)}
                      onBlur={triggerRecompress}
                      placeholder="DD-MM-YYYY"
                      className="w-full text-xs font-medium bg-white border border-[#DDD5C7] rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

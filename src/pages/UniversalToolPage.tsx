import React, { useEffect } from 'react';
import { 
  Camera, 
  PenTool, 
  Fingerprint, 
  Calendar, 
  ArrowLeft, 
  CheckCircle, 
  HelpCircle, 
  ChevronDown, 
  ShieldCheck, 
  Sparkles,
  Sliders,
  FileCheck
} from 'lucide-react';
import { ToolType, ExamSpecItem } from '../types';
import { ImageToolWorkspace } from '../components/ImageToolWorkspace';
import { updatePageSeo } from '../utils/seo';

interface UniversalToolPageProps {
  toolType: ToolType;
  onNavigate: (path: string) => void;
}

interface UniversalToolMeta {
  title: string;
  description: string;
  keywords: string[];
  canonicalPath: string;
  spec: ExamSpecItem;
  heading: string;
  intro: string;
  guidePoints: string[];
  faqs: { q: string; a: string }[];
}

const PHOTO_CONFIG: UniversalToolMeta = {
  title: 'Online Exam Photo Resizer & Compressor in KB (20KB - 50KB)',
  description: 'Free online photo resizer and compressor in exact KB (10KB, 20KB, 50KB, 100KB) and pixels for UPSC, SSC, IBPS, NEET, and State PSC exams.',
    keywords: [
      'online photo resizer in kb',
      'photo compressor 20kb to 50kb',
      'passport photo resize for exam',
      'upsc photo resize',
      'ssc cgl photo compressor',
      'image compress in kb',
    ],
    canonicalPath: '/tools/photo-compressor',
    spec: {
      minKB: 20,
      maxKB: 50,
      exactWidth: 350,
      exactHeight: 450,
      aspectRatio: '3.5:4.5',
      format: 'JPEG',
      notes: 'Universal preset (20KB - 50KB). Adjust the dimensions and KB sliders to match any central or state exam bulletin.',
    },
    heading: 'Universal Online Photo Resizer & Compressor for Government Exams',
    intro: 'Nearly every competitive recruitment exam in India—including UPSC Civil Services, SSC (CGL, CHSL, MTS), IBPS, SBI, Railway RRB, and State Public Service Commissions—demands candidate passport photographs within rigid byte boundaries (commonly 20 KB to 50 KB or up to 100 KB) and strict aspect ratios (usually 3.5 cm x 4.5 cm). Uploading a file even 0.1 KB over the limit or with warped aspect ratios triggers immediate rejection by automated portal validation scripts. This tool guarantees exact byte-level compliance using browser-native HTML5 Canvas algorithms.',
    guidePoints: [
      'Upload any standard portrait or passport photo from your mobile phone or PC.',
      'Adjust the Target KB Range sliders (default: 20 KB - 50 KB) or customize pixel width/height.',
      'Ensure the candidate face covers 70% to 80% of the image frame with both ears clearly visible.',
      'Download your scrutinized, compressed JPEG file instantly in less than 0.5 seconds with zero server upload.',
    ],
    faqs: [
      {
        q: 'How do I compress my photo to strictly between 20 KB and 50 KB?',
        a: 'Simply select your photo in the upload box above. The tool automatically runs progressive binary compression to place your output between 20 KB and 50 KB without blurriness or distortion. If your exam requires 50-100 KB, simply adjust the Max KB slider.',
      },
      {
        q: 'What is the standard passport photo dimension in pixels for Indian exams?',
        a: 'The most common standard is 350 x 450 pixels (representing 3.5 cm x 4.5 cm) at 200 DPI. Certain portals like UPSC accept 350x350 to 1000x1000 pixels, while IBPS uses 200 x 230 pixels.',
      },
      {
        q: 'Why does the recruitment portal say "File size exceeds 50 KB" or "Invalid format"?',
        a: 'Phone cameras capture images in 3 MB to 10 MB files. If you compress using uncalibrated online tools, the file either remains too large or compresses below the minimum limit (e.g. 18 KB). Our compressor guarantees exact compliance within the specified boundary.',
      },
    ],
  };

const TOOL_CONFIGS: Record<string, UniversalToolMeta> = {
  photo: PHOTO_CONFIG,
  universal: PHOTO_CONFIG,
  signature: {
    title: 'Online Signature Resizer & Enhancer (10KB - 20KB)',
    description: 'Resize signature to 10KB - 20KB, remove grey paper background, and darken blue/black ink for SSC, IBPS, UPSC, and State exams.',
    keywords: [
      'signature resize 10 to 20 kb',
      'signature compress for exam',
      'online signature cleaner',
      'ssc signature 140x60',
      'anti blur signature resizer',
    ],
    canonicalPath: '/tools/signature-resize',
    spec: {
      minKB: 10,
      maxKB: 20,
      exactWidth: 140,
      exactHeight: 60,
      aspectRatio: '140:60',
      format: 'JPEG',
      notes: 'Pica.js Lanczos3 multi-pass downsampling with luminance ink darkening and white paper background filter.',
    },
    heading: 'High-Fidelity Signature Resizer with Ink Enhancement & Paper Whitening',
    intro: 'Resizing candidate signatures to tiny resolutions like 140 x 60 pixels frequently turns delicate pen strokes into illegible, blurry smudges. Examination authorities like SSC, IBPS, and UPSC immediately reject blurry signatures during computer-based examination registration. Our dedicated signature pipeline pairs high-quality Pica.js Lanczos3 downsampling with adaptive paper background whitening and ink contrast boosting so your signature remains crisp, clear, and perfectly readable.',
    guidePoints: [
      'Sign with dark blue or black ink on unruled, clean white paper in good lighting.',
      'Crop tight around your handwritten signature to avoid excessive empty borders.',
      'Leave "Anti-Blur & Whiten Paper" checked to clean yellowish phone shadows and sharpen ink strokes.',
      'Check the Live Scrutiny Preview to confirm your file is squarely between 10 KB and 20 KB.',
    ],
    faqs: [
      {
        q: 'Why do signatures look blurry after resizing to 140x60 pixels?',
        a: 'Standard browser canvas downscaling drops pixel sub-samples, making thin ink lines fade into grey paper noise. We utilize Pica.js with Lanczos-3 resampling and a 3x3 unsharp convolution kernel to retain pen stroke thickness and razor-sharp contrast.',
      },
      {
        q: 'What color ink should be used for exam signatures?',
        a: 'Unless specified otherwise, use black ink or dark blue ink on plain white paper. Never use red, green, or pencil signatures as automated portal OCR filters will fail to detect them.',
      },
    ],
  },
  thumb: {
    title: 'Left Thumb Impression Resizer & Cleaner (20KB - 50KB)',
    description: 'Resize left thumb impression (LTI) to 20KB - 50KB and 240x240 pixels at 200 DPI for IBPS, SBI, NTA, and police recruitment.',
    keywords: [
      'thumb impression resize 20 to 50 kb',
      'left thumb impression resizer',
      'ibps lti size 240x240',
      'thumb print cleaner',
      'biometric thumb resizer',
    ],
    canonicalPath: '/tools/thumb-impression',
    spec: {
      minKB: 20,
      maxKB: 50,
      exactWidth: 240,
      exactHeight: 240,
      aspectRatio: '1:1',
      format: 'JPEG',
      dpi: 200,
      notes: 'Ridge line sharpening filter enabled. Eliminates stamp pad ink smearing.',
    },
    heading: 'Left Hand Thumb Impression (LTI) Resizer & Ridge Line Enhancer',
    intro: 'Banking exams (IBPS PO, Clerk, SO, SBI), DSSSB, NTA NEET/JEE, and Central Police forces require candidates to upload a clear Left Hand Thumb Impression (LTI). Official recruitment guidelines mandate that ridge lines must be distinct without smudges, sized strictly between 20 KB and 50 KB at a 1:1 square aspect ratio. This tool automatically cleans paper texture, sharpens fingerprint loops and whorls, and formats files to the exact required KB.',
    guidePoints: [
      'Press your left thumb gently onto a blue or black stamp pad and stamp onto clean white paper.',
      'Take a well-lit photograph perpendicular to the paper without shadows.',
      'The tool sharpens biometric ridge lines and ensures the file meets 20 KB - 50 KB at 200 DPI.',
      'Download your certified thumb impression image ready for instant portal submission.',
    ],
    faqs: [
      {
        q: 'What if a candidate does not have a left thumb?',
        a: 'Most examination rules (such as IBPS and SSC) allow right thumb impression or another finger in case of physical disability, provided a medical certificate or note is uploaded as instructed in the notification.',
      },
      {
        q: 'What ink pad is accepted for thumb impression?',
        a: 'Standard blue or black stamp pad ink is accepted across all Indian recruitment boards. Avoid gel pens or marker inks.',
      },
    ],
  },
  namedate: {
    title: 'Add Name & Date of Photo (DOP) on Passport Photo Tool',
    description: 'Print candidate name and date of photo (DOP) on a clean white bottom strip for SSC, UPPSC, TNPSC, and Kerala PSC online applications.',
    keywords: [
      'name and date on photo',
      'date of photo generator',
      'ssc photo with name and date',
      'kerala psc photo date stamp',
      'dop photo maker online',
    ],
    canonicalPath: '/tools/name-date-on-photo',
    spec: {
      minKB: 20,
      maxKB: 50,
      exactWidth: 350,
      exactHeight: 450,
      aspectRatio: '3.5:4.5',
      format: 'JPEG',
      requireNameDate: true,
      notes: 'Renders official rectangular bottom strip with bold uppercase candidate name and DOP.',
    },
    heading: 'Candidate Name and Date of Photograph (DOP) Stamp Generator',
    intro: 'Several premier examination boards—including SSC, UPPSC, UKPSC, TNPSC, and Kerala PSC—require candidate passport photos to feature the candidate’s printed name and the date the photograph was captured (Date of Photo / DOP) on a clean white strip at the bottom of the photo. Failure to print the DOP, or uploading a photograph dated older than 3 months, results in outright rejection of the candidate’s online application without refund. Our generator bakes sharp, readable typography directly onto your photo canvas.',
    guidePoints: [
      'Upload your passport photo and enter your full name as registered in your 10th/Matriculation certificate.',
      'Enter the Date of Photo (DOP), ensuring it falls within the last 10 to 90 days as mandated by the exam board.',
      'Adjust font sizing or bottom strip height in real time on the live preview.',
      'Download the stamped photo compressed to 20 KB - 50 KB with compliant typography.',
    ],
    faqs: [
      {
        q: 'What date should be printed on the photograph?',
        a: 'The date printed must be the actual date the photo was taken, typically within 10 days to 3 months prior to the date of notification publication. Never print your date of birth (DOB) instead of DOP.',
      },
      {
        q: 'Which exams strictly require Name and Date on the photo?',
        a: 'SSC (Staff Selection Commission), UPPSC (Uttar Pradesh PSC), UKPSC (Uttarakhand PSC), and Kerala PSC have strict mandatory rules for candidate Name & DOP on online application photographs.',
      },
    ],
  },
  declaration: {
    title: 'Handwritten Declaration Resizer (50KB - 100KB) - Image Compress Cloud',
    description: 'Resize and compress candidate handwritten declaration to 50KB - 100KB for IBPS, SBI, and bank recruitment portals.',
    keywords: ['handwritten declaration resize', 'ibps declaration size', 'sbi declaration compress 50 to 100 kb'],
    canonicalPath: '/tools/photo-compressor',
    spec: {
      minKB: 50,
      maxKB: 100,
      exactWidth: 800,
      exactHeight: 400,
      format: 'JPEG',
      notes: 'IBPS/SBI handwritten declaration format.',
    },
    heading: 'Handwritten Declaration Resizer for Banking Examinations',
    intro: 'Bank recruitment examinations like IBPS PO, Clerk, RRB, and SBI mandate an uploaded handwritten declaration written in English by the candidate in black ink on white paper, sized strictly between 50 KB and 100 KB.',
    guidePoints: [
      'Write the official declaration text in your own handwriting using black ink.',
      'Ensure no capital letters are used for the whole text (only normal capitalization).',
      'Crop cleanly around the text and compress to 50 KB - 100 KB.',
    ],
    faqs: [
      {
        q: 'What is the required size for bank handwritten declarations?',
        a: 'IBPS and SBI require the handwritten declaration file to be between 50 KB and 100 KB in JPEG format.',
      },
    ],
  },
};

export const UniversalToolPage: React.FC<UniversalToolPageProps> = ({ toolType, onNavigate }) => {
  const currentConfig = TOOL_CONFIGS[toolType] || TOOL_CONFIGS.photo;

  useEffect(() => {
    window.scrollTo(0, 0);
    updatePageSeo({
      title: currentConfig.title,
      description: currentConfig.description,
      keywords: currentConfig.keywords,
      canonicalPath: currentConfig.canonicalPath,
      structuredData: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            name: currentConfig.title,
            description: currentConfig.description,
            url: `https://image-compress.cloud${currentConfig.canonicalPath}`,
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
                name: currentConfig.title,
                item: `https://image-compress.cloud${currentConfig.canonicalPath}`,
              },
            ],
          },
        ],
      },
    });
  }, [toolType]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Crawlable Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-stone-500 mb-6">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
          }}
          className="hover:text-stone-800 flex items-center gap-1 font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          All Exams Directory
        </a>
        <span>/</span>
        <span className="text-stone-400">Universal Tools</span>
        <span>/</span>
        <span className="text-stone-800 font-semibold truncate">{currentConfig.title}</span>
      </div>

      {/* Header Banner */}
      <div className="bg-[#FAF8F5] border border-[#E5DFD3] rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            {toolType === 'signature' ? (
              <PenTool className="w-5 h-5" />
            ) : toolType === 'thumb' ? (
              <Fingerprint className="w-5 h-5" />
            ) : toolType === 'namedate' ? (
              <Calendar className="w-5 h-5" />
            ) : (
              <Camera className="w-5 h-5" />
            )}
          </div>
          <div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 leading-tight">
              {currentConfig.title}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">{currentConfig.description}</p>
          </div>
        </div>
      </div>

      {/* Interactive Tool Workspace */}
      <div className="mb-12">
        <ImageToolWorkspace
          key={toolType}
          toolType={toolType}
          examName="Universal Tool"
          spec={currentConfig.spec}
        />
      </div>

      {/* Rich Instructional Guide & FAQ Section (>250 Words for Strong SEO) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-[#FAF8F5] border border-[#E5DFD3] rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-stone-900">
            {currentConfig.heading}
          </h2>

          <p className="text-sm text-stone-700 leading-relaxed">
            {currentConfig.intro}
          </p>

          <div className="bg-[#F4EFE6] border border-[#E3DACD] rounded-xl p-5 space-y-3">
            <h3 className="font-semibold text-sm text-stone-900 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-700" />
              Step-by-Step Instructions:
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
              {currentConfig.guidePoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 shrink-0"></span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-4 pt-4 border-t border-[#EAE3D6]">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-700" />
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Frequently Asked Questions
              </h3>
            </div>
            <div className="space-y-3">
              {currentConfig.faqs.map((faq, idx) => (
                <details
                  key={idx}
                  className="group bg-[#FBF8F3] border border-[#E8E0D2] rounded-xl overflow-hidden transition-all shadow-2xs"
                >
                  <summary className="w-full p-4 font-serif font-bold text-stone-900 text-sm flex items-center justify-between cursor-pointer select-none hover:bg-[#F4EFE6]/50 transition-colors list-none">
                    <span>{faq.q}</span>
                    <ChevronDown className="w-4 h-4 text-stone-500 group-open:rotate-180 transition-transform duration-200 shrink-0 ml-2" />
                  </summary>
                  <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-stone-700 leading-relaxed border-t border-[#EFE9DE]">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Specifications Sheet */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#F5EFE6] border border-[#E2DAD0] rounded-2xl p-6">
            <h3 className="font-serif font-bold text-base text-stone-900 mb-4 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-700" />
              Default Preset Limits
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#E7DFD3]">
                <span className="text-stone-600 font-medium">Standard KB Bounds:</span>
                <span className="font-bold text-amber-800">
                  {currentConfig.spec.minKB} KB - {currentConfig.spec.maxKB} KB
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E7DFD3]">
                <span className="text-stone-600 font-medium">Resolution:</span>
                <span className="font-bold text-stone-900">
                  {currentConfig.spec.exactWidth && currentConfig.spec.exactHeight
                    ? `${currentConfig.spec.exactWidth} x ${currentConfig.spec.exactHeight} px`
                    : currentConfig.spec.aspectRatio || 'Custom Aspect'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E7DFD3]">
                <span className="text-stone-600 font-medium">File Format:</span>
                <span className="font-bold text-stone-900">{currentConfig.spec.format || 'JPEG / JPG'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-stone-600 font-medium">Client Processing:</span>
                <span className="font-bold text-emerald-700">0.5s In-Memory RAM</span>
              </div>
            </div>
          </div>

          <div className="bg-[#FAF8F5] border border-[#E5DFD3] rounded-2xl p-5 text-xs text-stone-600 space-y-2">
            <h4 className="font-semibold text-stone-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              100% Privacy Guarantee
            </h4>
            <p>
              Your candidate documents are processed using client-side in-memory canvas buffers on your phone or computer. No images ever leave your browser.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

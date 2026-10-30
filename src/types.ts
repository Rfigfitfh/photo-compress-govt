export type ToolType = 'photo' | 'signature' | 'thumb' | 'declaration' | 'universal' | 'namedate';

export interface ExamSpecItem {
  minKB: number;
  maxKB: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  exactWidth?: number;
  exactHeight?: number;
  aspectRatio?: string; // e.g. "3.5:4.5", "1:1", "140:60"
  format: 'JPEG' | 'JPG' | 'PNG';
  dpi?: number;
  notes: string;
  backgroundRule?: string;
  requireNameDate?: boolean;
  dimensionLabel?: string;
}

export interface ExamBody {
  id: string;
  slug: string;
  name: string;
  fullName: string;
  category: 'National' | 'Banking' | 'Defence' | 'Engineering & Medical' | 'Railway' | 'Teaching' | 'State PSC & Police';
  state: string; // e.g. 'Central / All India', 'Uttar Pradesh', 'Bihar', 'Rajasthan', etc.
  popular: boolean;
  photo: ExamSpecItem;
  signature: ExamSpecItem;
  thumb?: ExamSpecItem;
  declaration?: ExamSpecItem;
  guidelines: string[];
  officialWebsite: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  articleContent: {
    intro: string;
    rules: string[];
    commonMistakes: string[];
    dimensionsGuide: string;
  };
}

export interface DedicatedTool {
  id: string;
  slug: string; // e.g. 'ssc-signature-resize'
  examId: string;
  examName: string;
  state: string;
  toolType: ToolType;
  title: string;
  shortTitle: string;
  badge: string;
  spec: ExamSpecItem;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  article: {
    heading: string;
    instructions: string[];
    portalWarning: string;
    specsTable: { label: string; value: string }[];
  };
}

export interface CompressionOptions {
  targetKB: number;
  minKB?: number;
  maxKB?: number;
  targetWidth?: number;
  targetHeight?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  exactWidth?: number;
  exactHeight?: number;
  lockAspectRatio?: boolean;
  format?: 'image/jpeg' | 'image/png';
  dpi?: number;
  addNameDate?: boolean;
  candidateName?: string;
  dateOfPhoto?: string;
  cleanSignature?: boolean; // enhance contrast, threshold grey paper to pure white
  cleanThumb?: boolean; // boost fingerprint ridge contrast
  isSignature?: boolean; // signature mode: uses Pica.js Lanczos3 resampling
  isDeclaration?: boolean; // preserve full handwritten document without cropping
  inkBoost?: number; // 1 = normal, 2 = enhanced/crisp, 3 = extra bold/dark
  quality?: number; // 0.1 to 1.0
}

export interface CompressionResult {
  dataUrl: string;
  blob: Blob;
  sizeBytes: number;
  sizeKB: number;
  width: number;
  height: number;
  mimeType: string;
  format: string;
  qualityUsed: number;
  passesSpec: boolean;
  specFeedback: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  readTime: string;
  date: string;
  category: string;
  content: string;
}

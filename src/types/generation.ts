export interface GenerationRequest {
  prompt: string;
  systemPrompt?: string;
  template?: string;
}

export interface GeneratedFile {
  path: string;
  content: string;
  type: 'component' | 'page' | 'api' | 'config' | 'style' | 'utility';
}

export interface GenerationResponse {
  success: boolean;
  files: GeneratedFile[];
  dependencies?: string[];
  instructions?: string;
  error?: string;
}

export interface GenerationHistory {
  id: string;
  prompt: string;
  timestamp: Date;
  files: GeneratedFile[];
  previewUrl?: string;
}

export interface AppTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
  category: 'dashboard' | 'ecommerce' | 'blog' | 'portfolio' | 'utility' | 'game' | 'other';
}

export interface GenerationProgress {
  step: 'analyzing' | 'generating' | 'structuring' | 'completing';
  message: string;
  progress: number; // 0-100
}
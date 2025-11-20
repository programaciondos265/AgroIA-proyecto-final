// Tipos para el análisis de plagas
export interface PestDetection {
  pestType: string;
  confidence: number;
  description: string;
  treatment: string;
  severity: 'low' | 'medium' | 'high';
}

export interface AnalysisResult {
  hasPest: boolean;
  detections: PestDetection[];
  imageAnalysis: {
    brightness: number;
    contrast: number;
    quality: 'good' | 'fair' | 'poor';
    dimensions: { width: number; height: number };
    fileSize: number;
  };
  recommendations: string[];
}

export interface AnalysisMetadata {
  cropType?: string;
  location?: string;
  notes?: string;
  analyzedAt?: string;
  userId?: string;
}


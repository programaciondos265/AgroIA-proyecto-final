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

class PestAnalysisService {
  private apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  // Analizar imagen (versión simplificada sin backend)
  async analyzeImage(imageData: string, metadata?: {
    cropType?: string;
    location?: string;
    notes?: string;
  }): Promise<AnalysisResult> {
    try {
      // Simular un pequeño delay para que parezca que está procesando
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Retornar resultado de ejemplo
      const mockResult: AnalysisResult = {
        hasPest: true,
        detections: [
          {
            pestType: 'Mosca blanca',
            confidence: 0.74,
            description: 'Plaga común en cultivos de tomate, pimiento y otros cultivos hortícolas.',
            treatment: 'Aplicar insecticida específico para mosca blanca. Se recomienda tratamiento preventivo.',
            severity: 'medium'
          }
        ],
        imageAnalysis: {
          brightness: 75,
          contrast: 68,
          quality: 'good',
          dimensions: { width: 1920, height: 1080 },
          fileSize: 1024000
        },
        recommendations: [
          'Monitorear el cultivo regularmente',
          'Mantener buena ventilación en el área',
          'Aplicar tratamiento preventivo cada 15 días',
          'Revisar otras plantas cercanas'
        ]
      };

      return mockResult;
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw new Error('Error al analizar la imagen');
    }
  }


  // Método para obtener estadísticas de análisis
  getAnalysisStats(analyses: AnalysisResult[]): {
    totalAnalyses: number;
    pestDetections: number;
    mostCommonPest: string | null;
    averageConfidence: number;
  } {
    const totalAnalyses = analyses.length;
    const pestDetections = analyses.filter(a => a.hasPest).length;
    
    const allPests = analyses.flatMap(a => a.detections.map(d => d.pestType));
    const pestCounts = allPests.reduce((acc, pest) => {
      acc[pest] = (acc[pest] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostCommonPest = Object.keys(pestCounts).length > 0 
      ? Object.keys(pestCounts).reduce((a, b) => pestCounts[a] > pestCounts[b] ? a : b)
      : null;
    
    const averageConfidence = analyses.length > 0
      ? analyses.reduce((sum, a) => 
          sum + a.detections.reduce((detSum, d) => detSum + d.confidence, 0) / Math.max(a.detections.length, 1), 0
        ) / analyses.length
      : 0;

    return {
      totalAnalyses,
      pestDetections,
      mostCommonPest,
      averageConfidence
    };
  }
}

export const pestAnalysisService = new PestAnalysisService();

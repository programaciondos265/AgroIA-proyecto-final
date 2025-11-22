import sharp from 'sharp';
import { PestAnalysis, PestAnalysisModel } from '../models/FirebaseModels';

// Tipo para el resultado del análisis (compatible con PestAnalysis)
export type AnalysisResult = PestAnalysis['analysisResult'];

export interface PestType {
  name: string;
  description: string;
  treatment: string;
  severity: 'low' | 'medium' | 'high';
}

// Tipo para el resultado del análisis (compatible con PestAnalysis)
export type ImageAnalysisResult = PestAnalysis['analysisResult'];

class PestAnalysisService {
  private readonly pestTypes: PestType[] = [
    {
      name: 'Pulgón',
      description: 'Insecto pequeño que se alimenta de la savia de las plantas',
      treatment: 'Aplicar jabón insecticida o aceite de neem',
      severity: 'medium',
    },
    {
      name: 'Mosca blanca',
      description: 'Insecto volador que causa daño por succión',
      treatment: 'Usar trampas amarillas y control biológico',
      severity: 'high',
    },
    {
      name: 'Araña roja',
      description: 'Ácaro que causa manchas amarillas en las hojas',
      treatment: 'Aumentar humedad y usar acaricidas',
      severity: 'medium',
    },
    {
      name: 'Oídio',
      description: 'Hongo que forma una capa blanca en las hojas',
      treatment: 'Aplicar fungicida de azufre',
      severity: 'high',
    },
    {
      name: 'Escarabajo de la patata',
      description: 'Escarabajo que se alimenta de hojas de solanáceas',
      treatment: 'Recolección manual y uso de Bacillus thuringiensis',
      severity: 'medium',
    },
  ];

  /**
   * Analiza una imagen para detectar plagas
   * @param imageBuffer - Buffer de la imagen a analizar
   * @returns Resultado del análisis con detecciones y recomendaciones
   */
  async analyzeImageForPests(imageBuffer: Buffer): Promise<ImageAnalysisResult> {
    try {
      // Procesar imagen con Sharp para obtener metadatos
      const metadata = await sharp(imageBuffer).metadata();

      // Simular análisis con datos aleatorios pero realistas
      const random = Math.random();

      const detections: ImageAnalysisResult['detections'] = [];

      // Simular detección de plagas (35% de probabilidad)
      if (random < 0.35) {
        const pestCount = Math.floor(Math.random() * 2) + 1; // 1-2 plagas

        for (let i = 0; i < pestCount; i++) {
          const pest = this.pestTypes[Math.floor(Math.random() * this.pestTypes.length)];
          detections.push({
            pestType: pest.name,
            confidence: Math.random() * 0.3 + 0.7, // 70-100%
            description: pest.description,
            treatment: pest.treatment,
            severity: pest.severity,
          });
        }
      }

      // Análisis de calidad de imagen basado en metadatos
      const brightness = Math.random() * 100;
      const contrast = Math.random() * 100;
      const quality =
        brightness > 50 && contrast > 40
          ? 'good'
          : brightness > 30 && contrast > 25
            ? 'fair'
            : 'poor';

      // Generar recomendaciones
      const recommendations = this.generateRecommendations(detections, quality, metadata);

      return {
        hasPest: detections.length > 0,
        detections,
        imageAnalysis: {
          brightness,
          contrast,
          quality,
          dimensions: {
            width: metadata.width || 0,
            height: metadata.height || 0,
          },
          fileSize: imageBuffer.length,
        },
        recommendations,
      };
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw new Error('Error al procesar la imagen');
    }
  }

  /**
   * Genera recomendaciones basadas en las detecciones y calidad de imagen
   */
  private generateRecommendations(
    detections: ImageAnalysisResult['detections'],
    quality: 'good' | 'fair' | 'poor',
    metadata: sharp.Metadata
  ): string[] {
    const recommendations: string[] = [];

    if (detections.length > 0) {
      recommendations.push('Se detectaron plagas en tu cultivo');
      recommendations.push('Aplica el tratamiento recomendado lo antes posible');

      if (detections.some((d) => d.severity === 'high')) {
        recommendations.push('⚠️ Plagas de alta severidad detectadas - acción inmediata requerida');
      }

      // Recomendaciones específicas por tipo de plaga
      const pestTypes = detections.map((d) => d.pestType);
      if (pestTypes.includes('Pulgón')) {
        recommendations.push('💡 Para pulgones, considera usar mariquitas como control biológico');
      }
      if (pestTypes.includes('Mosca blanca')) {
        recommendations.push('💡 Las trampas adhesivas amarillas son muy efectivas contra moscas blancas');
      }
    } else {
      recommendations.push('✅ No se detectaron plagas en la imagen');
      recommendations.push('Tu cultivo se ve saludable');
      recommendations.push('💡 Continúa monitoreando regularmente para prevenir infestaciones');
    }

    if (quality === 'poor') {
      recommendations.push('💡 Mejora la iluminación para un mejor análisis');
    }

    if (metadata.width && metadata.height) {
      const aspectRatio = metadata.width / metadata.height;
      if (aspectRatio < 0.8 || aspectRatio > 1.2) {
        recommendations.push('💡 Intenta tomar la foto más centrada en la planta');
      }
    }

    return recommendations;
  }

  /**
   * Crea un análisis de plaga en la base de datos
   */
  async createAnalysis(
    userId: string,
    imageData: string,
    analysisResult: ImageAnalysisResult,
    metadata?: {
      cropType?: string;
      location?: string;
      notes?: string;
    },
    photoTimestamp?: Date
  ): Promise<PestAnalysis> {
    return await PestAnalysisModel.create({
      userId,
      imageUrl: '',
      imageData,
      analysisResult: analysisResult as PestAnalysis['analysisResult'],
      metadata: {
        cropType: metadata?.cropType || undefined,
        location: metadata?.location || undefined,
        notes: metadata?.notes || undefined,
      },
      photoTimestamp,
    });
  }
}

export const pestAnalysisService = new PestAnalysisService();


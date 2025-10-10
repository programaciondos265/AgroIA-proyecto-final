import { Request, Response } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { PestAnalysisModel, PestAnalysis } from '../models/FirebaseModels';
import { auth } from '../config/firebase';

// Extender el tipo Request para incluir userId y file de Multer
interface AuthRequest extends Request {
  userId: string;
  file?: Express.Multer.File;
}

// Configuración de multer para subida de imágenes
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB límite
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'));
    }
  }
});

// Middleware para verificar token de Firebase
const verifyFirebaseToken = async (req: Request, res: Response, next: any) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de autorización requerido'
      });
    }

    const decodedToken = await auth.verifyIdToken(token);
    (req as AuthRequest).userId = decodedToken.uid;
    next();
  } catch (error) {
    console.error('Firebase token verification error:', error);
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

// Simulación de análisis de plagas (en producción usarías un modelo real de IA)
async function analyzeImageForPests(imageBuffer: Buffer): Promise<PestAnalysis['analysisResult']> {
  try {
    // Procesar imagen con Sharp para obtener metadatos
    const metadata = await sharp(imageBuffer).metadata();
    
    // Simular análisis con datos aleatorios pero realistas
    const random = Math.random();
    
    const pestTypes = [
      {
        name: 'Pulgón',
        description: 'Insecto pequeño que se alimenta de la savia de las plantas',
        treatment: 'Aplicar jabón insecticida o aceite de neem',
        severity: 'medium' as const
      },
      {
        name: 'Mosca blanca',
        description: 'Insecto volador que causa daño por succión',
        treatment: 'Usar trampas amarillas y control biológico',
        severity: 'high' as const
      },
      {
        name: 'Araña roja',
        description: 'Ácaro que causa manchas amarillas en las hojas',
        treatment: 'Aumentar humedad y usar acaricidas',
        severity: 'medium' as const
      },
      {
        name: 'Oídio',
        description: 'Hongo que forma una capa blanca en las hojas',
        treatment: 'Aplicar fungicida de azufre',
        severity: 'high' as const
      },
      {
        name: 'Escarabajo de la patata',
        description: 'Escarabajo que se alimenta de hojas de solanáceas',
        treatment: 'Recolección manual y uso de Bacillus thuringiensis',
        severity: 'medium' as const
      }
    ];

    const detections: any[] = [];
    
    // Simular detección de plagas (35% de probabilidad)
    if (random < 0.35) {
      const pestCount = Math.floor(Math.random() * 2) + 1; // 1-2 plagas
      
      for (let i = 0; i < pestCount; i++) {
        const pest = pestTypes[Math.floor(Math.random() * pestTypes.length)];
        detections.push({
          pestType: pest.name,
          confidence: Math.random() * 0.3 + 0.7, // 70-100%
          description: pest.description,
          treatment: pest.treatment,
          severity: pest.severity
        });
      }
    }

    // Análisis de calidad de imagen basado en metadatos
    const brightness = Math.random() * 100;
    const contrast = Math.random() * 100;
    const quality = brightness > 50 && contrast > 40 ? 'good' : 
                   brightness > 30 && contrast > 25 ? 'fair' : 'poor';

    // Generar recomendaciones
    const recommendations: string[] = [];
    
    if (detections.length > 0) {
      recommendations.push('Se detectaron plagas en tu cultivo');
      recommendations.push('Aplica el tratamiento recomendado lo antes posible');
      
      if (detections.some((d: any) => d.severity === 'high')) {
        recommendations.push('⚠️ Plagas de alta severidad detectadas - acción inmediata requerida');
      }
      
      // Recomendaciones específicas por tipo de plaga
      const pestTypes = detections.map((d: any) => d.pestType);
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

    return {
      hasPest: detections.length > 0,
      detections,
      imageAnalysis: {
        brightness,
        contrast,
        quality,
        dimensions: {
          width: metadata.width || 0,
          height: metadata.height || 0
        },
        fileSize: imageBuffer.length
      },
      recommendations
    };
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw new Error('Error al procesar la imagen');
  }
}

// Middleware para manejar la subida de archivos
export const uploadMiddleware = upload.single('image');

// Analizar imagen de plaga
export const analyzePestImage = [verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    
    if (!authReq.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ninguna imagen'
      });
    }

    const { cropType, location, notes, photoTimestamp } = req.body;
    const userId = authReq.userId;

    // Analizar la imagen
    const analysisResult = await analyzeImageForPests(authReq.file.buffer);

    // Convertir imagen a base64 para almacenamiento
    const imageData = `data:${authReq.file.mimetype};base64,${authReq.file.buffer.toString('base64')}`;

    // Crear análisis en Firestore
    console.log('🔍 analyzePestImage - Creando análisis en Firestore...');
    console.log('🔍 analyzePestImage - userId:', userId);
    console.log('🔍 analyzePestImage - analysisResult:', analysisResult);
    console.log('🔍 analyzePestImage - photoTimestamp recibido:', photoTimestamp);
    console.log('🔍 analyzePestImage - photoTimestamp tipo:', typeof photoTimestamp);
    console.log('🔍 analyzePestImage - photoTimestamp existe:', !!photoTimestamp);
    
    // Convertir photoTimestamp a Date si existe
    let photoTimestampDate: Date | undefined;
    if (photoTimestamp) {
      photoTimestampDate = new Date(photoTimestamp);
      console.log('🔍 analyzePestImage - photoTimestamp convertido:', photoTimestampDate);
    } else {
      console.log('🔍 analyzePestImage - No hay photoTimestamp (imagen de galería)');
    }
    
    const analysis = await PestAnalysisModel.create({
      userId,
      imageUrl: '', // En producción, subir a Firebase Storage
      imageData,
      analysisResult,
      metadata: {
        cropType: cropType || null,
        location: location || null,
        notes: notes || null
      },
      photoTimestamp: photoTimestampDate
    });
    
    console.log('🔍 analyzePestImage - analysis.createdAt:', analysis.createdAt);
    console.log('✅ analyzePestImage - Análisis creado exitosamente:', analysis.id);

    res.json({
      success: true,
      message: 'Análisis completado exitosamente',
      data: {
        analysis,
        metadata: {
          cropType: cropType || null,
          location: location || null,
          notes: notes || null,
          analyzedAt: photoTimestamp ? new Date(photoTimestamp).toISOString() : new Date().toISOString(),
          userId: userId
        }
      }
    });

  } catch (error) {
    console.error('Error in analyzePestImage:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al analizar la imagen'
    });
  }
}];

// Obtener historial de análisis del usuario
export const getAnalysisHistory = [verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.userId;
    const { page = 1, limit = 10, hasPest } = req.query;

    console.log('🔍 getAnalysisHistory - userId:', userId);
    console.log('🔍 getAnalysisHistory - query params:', { page, limit, hasPest });

    if (!userId) {
      console.error('❌ No userId found in request');
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    console.log('🔍 Verificando Firebase...');
    const { firestore } = await import('../config/firebase');
    if (!firestore) {
      console.error('❌ Firebase Firestore no está disponible');
      return res.status(500).json({
        success: false,
        message: 'Firebase no está configurado correctamente'
      });
    }
    console.log('✅ Firebase Firestore disponible');

    console.log('📊 Calling PestAnalysisModel.findByUserId...');
    const analyses = await PestAnalysisModel.findByUserId(userId, parseInt(limit as string) * parseInt(page as string));
    console.log('📊 Found analyses:', analyses.length);
    
    // Filtrar por hasPest si se especifica
    let filteredAnalyses = analyses;
    if (hasPest !== undefined) {
      const hasPestBool = hasPest === 'true';
      filteredAnalyses = analyses.filter(a => a.analysisResult.hasPest === hasPestBool);
    }

    // Paginación
    const startIndex = (parseInt(page as string) - 1) * parseInt(limit as string);
    const endIndex = startIndex + parseInt(limit as string);
    const paginatedAnalyses = filteredAnalyses.slice(startIndex, endIndex);

    console.log('✅ Returning paginated analyses:', paginatedAnalyses.length);
    
    // Log detallado de las fechas que se están devolviendo
    console.log('📅 Fechas que se devuelven al frontend:');
    paginatedAnalyses.forEach((analysis, index) => {
      console.log(`📅 Item ${index}:`, {
        id: analysis.id,
        createdAt: analysis.createdAt,
        createdAtType: typeof analysis.createdAt,
        createdAtInstance: analysis.createdAt instanceof Date,
        createdAtString: analysis.createdAt?.toString()
      });
    });

    res.json({
      success: true,
      message: 'Historial obtenido exitosamente',
      data: {
        history: paginatedAnalyses,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: filteredAnalyses.length,
          totalPages: Math.ceil(filteredAnalyses.length / parseInt(limit as string))
        }
      }
    });

  } catch (error) {
    console.error('❌ Error in getAnalysisHistory:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener el historial'
    });
  }
}];

// Obtener estadísticas de análisis del usuario
export const getAnalysisStats = [verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.userId;

    const stats = await PestAnalysisModel.getUserStats(userId);

    res.json({
      success: true,
      message: 'Estadísticas obtenidas exitosamente',
      data: stats
    });

  } catch (error) {
    console.error('Error in getAnalysisStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener las estadísticas'
    });
  }
}];

// Eliminar análisis del historial
export const deleteAnalysis = [verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const { analysisId } = req.params;
    const userId = authReq.userId;

    // Verificar que el análisis pertenece al usuario
    const analysis = await PestAnalysisModel.findById(analysisId);
    if (!analysis || analysis.userId !== userId) {
      return res.status(404).json({
        success: false,
        message: 'Análisis no encontrado'
      });
    }

    const deleted = await PestAnalysisModel.delete(analysisId);
    
    if (!deleted) {
      return res.status(500).json({
        success: false,
        message: 'Error al eliminar el análisis'
      });
    }

    res.json({
      success: true,
      message: 'Análisis eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error in deleteAnalysis:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al eliminar el análisis'
    });
  }
}];

// Eliminar todos los análisis antiguos con fechas incorrectas
export const deleteOldAnalyses = [verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.userId;

    console.log('🗑️ Eliminando análisis antiguos para userId:', userId);

    // Obtener todos los análisis del usuario
    const analyses = await PestAnalysisModel.findByUserId(userId, 1000);
    console.log('📊 Total de análisis encontrados:', analyses.length);

    // Filtrar análisis con fechas sospechosas (31 dic 2023, 18:00)
    const suspiciousDate = new Date('2023-12-31T18:00:00Z');
    const oldAnalyses = analyses.filter(analysis => {
      const createdAt = analysis.createdAt instanceof Date ? analysis.createdAt : new Date(analysis.createdAt);
      // Buscar fechas que sean exactamente 31 dic 2023, 18:00 o muy cercanas
      const timeDiff = Math.abs(createdAt.getTime() - suspiciousDate.getTime());
      return timeDiff < 60000; // Dentro de 1 minuto de diferencia
    });

    console.log('🔍 Análisis sospechosos encontrados:', oldAnalyses.length);
    oldAnalyses.forEach(analysis => {
      console.log('🗑️ Eliminando análisis:', {
        id: analysis.id,
        createdAt: analysis.createdAt,
        createdAtString: analysis.createdAt.toString()
      });
    });

    // Eliminar análisis antiguos
    let deletedCount = 0;
    for (const analysis of oldAnalyses) {
      const deleted = await PestAnalysisModel.delete(analysis.id);
      if (deleted) {
        deletedCount++;
      }
    }

    console.log('✅ Análisis antiguos eliminados:', deletedCount);

    res.json({
      success: true,
      message: `Se eliminaron ${deletedCount} análisis antiguos con fechas incorrectas`,
      deletedCount
    });

  } catch (error) {
    console.error('Error in deleteOldAnalyses:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al eliminar análisis antiguos'
    });
  }
}];
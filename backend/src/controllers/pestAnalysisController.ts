import { Request, Response } from 'express';
import multer from 'multer';
import { PestAnalysisModel } from '../models/FirebaseModels';
import { auth } from '../config/firebase';
import { pestAnalysisService } from '../services/pestAnalysisService';

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
  },
});

// Middleware para verificar token de Firebase
const verifyFirebaseToken = async (req: Request, res: Response, next: any) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de autorización requerido',
      });
    }

    const decodedToken = await auth?.verifyIdToken(token);
    if (!decodedToken) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido',
      });
    }

    (req as AuthRequest).userId = decodedToken.uid;
    next();
  } catch (error) {
    console.error('Firebase token verification error:', error);
    return res.status(401).json({
      success: false,
      message: 'Token inválido',
    });
  }
};


// Middleware para manejar la subida de archivos
export const uploadMiddleware = upload.single('image');

// Analizar imagen de plaga
export const analyzePestImage = [verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    
    if (!authReq.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ninguna imagen',
      });
    }

    const { cropType, location, notes, photoTimestamp } = req.body;
    const userId = authReq.userId;

    // Analizar la imagen usando el servicio
    const analysisResult = await pestAnalysisService.analyzeImageForPests(authReq.file.buffer);

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
    
    // Crear análisis usando el servicio
    const analysis = await pestAnalysisService.createAnalysis(
      userId,
      imageData,
      analysisResult,
      {
        cropType: cropType || undefined,
        location: location || undefined,
        notes: notes || undefined,
      },
      photoTimestampDate
    );
    
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
          analyzedAt: photoTimestamp
            ? new Date(photoTimestamp).toISOString()
            : new Date().toISOString(),
          userId: userId,
        },
      },
    });

  } catch (error) {
    console.error('Error in analyzePestImage:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al analizar la imagen',
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
        message: 'Usuario no autenticado',
      });
    }

    // Validación de paginación ya manejada por middleware

    console.log('📊 Calling PestAnalysisModel.findByUserId...');
    const analyses = await PestAnalysisModel.findByUserId(userId, parseInt(limit as string) * parseInt(page as string));
    console.log('📊 Found analyses:', analyses.length);
    
    // Filtrar por hasPest si se especifica
    let filteredAnalyses = analyses;
    if (hasPest !== undefined) {
      const hasPestBool = hasPest === 'true';
      filteredAnalyses = analyses.filter((a) => a.analysisResult.hasPest === hasPestBool);
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
        createdAtString: analysis.createdAt?.toString(),
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
          totalPages: Math.ceil(filteredAnalyses.length / parseInt(limit as string)),
        },
      },
    });

  } catch (error) {
    console.error('❌ Error in getAnalysisHistory:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener el historial',
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
      data: stats,
    });

  } catch (error) {
    console.error('Error in getAnalysisStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener las estadísticas',
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
        message: 'Análisis no encontrado',
      });
    }

    const deleted = await PestAnalysisModel.delete(analysisId);
    
    if (!deleted) {
      return res.status(500).json({
        success: false,
        message: 'Error al eliminar el análisis',
      });
    }

    res.json({
      success: true,
      message: 'Análisis eliminado exitosamente',
    });

  } catch (error) {
    console.error('Error in deleteAnalysis:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al eliminar el análisis',
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
    const oldAnalyses = analyses.filter((analysis) => {
      const createdAt = analysis.createdAt instanceof Date
        ? analysis.createdAt
        : new Date(analysis.createdAt);
      // Buscar fechas que sean exactamente 31 dic 2023, 18:00 o muy cercanas
      const timeDiff = Math.abs(createdAt.getTime() - suspiciousDate.getTime());
      return timeDiff < 60000; // Dentro de 1 minuto de diferencia
    });

    console.log('🔍 Análisis sospechosos encontrados:', oldAnalyses.length);
    oldAnalyses.forEach((analysis) => {
      console.log('🗑️ Eliminando análisis:', {
        id: analysis.id,
        createdAt: analysis.createdAt,
        createdAtString: analysis.createdAt.toString(),
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
      deletedCount,
    });

  } catch (error) {
    console.error('Error in deleteOldAnalyses:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al eliminar análisis antiguos',
    });
  }
}];
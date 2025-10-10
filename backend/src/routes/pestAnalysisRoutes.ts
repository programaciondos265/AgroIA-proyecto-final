import { Router } from 'express';
import {
  analyzePestImage,
  getAnalysisHistory,
  getAnalysisStats,
  deleteAnalysis,
  deleteOldAnalyses,
  uploadMiddleware
} from '../controllers/pestAnalysisController';

const router = Router();

// Analizar imagen de plaga (requiere autenticación)
router.post('/analyze', uploadMiddleware, analyzePestImage);

// Obtener historial de análisis (requiere autenticación)
router.get('/history', getAnalysisHistory);

// Obtener estadísticas de análisis (requiere autenticación)
router.get('/stats', getAnalysisStats);

// Eliminar análisis específico (requiere autenticación)
router.delete('/:analysisId', deleteAnalysis);

// Eliminar análisis antiguos con fechas incorrectas (requiere autenticación)
router.delete('/cleanup/old-analyses', deleteOldAnalyses);

export default router;

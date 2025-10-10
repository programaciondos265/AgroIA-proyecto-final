import { Router } from 'express';
import {
  analyzePestImage,
  getAnalysisHistory,
  getAnalysisStats,
  deleteAnalysis,
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

export default router;

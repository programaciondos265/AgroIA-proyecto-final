import { pestAnalysisService, AnalysisResult } from './pestAnalysisService';

// Tipo para los elementos del historial
export interface AnalysisHistoryItem {
  id: string;
  imageData: string;
  analysisResult: AnalysisResult;
  timestamp: Date;
  metadata?: any;
}

class HistoryService {
  // Obtener historial desde Firebase
  async getHistory(page: number = 1, limit: number = 10): Promise<{
    history: AnalysisHistoryItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      console.log('🔍 Obteniendo historial desde Firebase...');
      const result = await pestAnalysisService.getAnalysisHistory(page, limit);
      console.log('📊 Resultado del historial:', result);
      
      // Transformar los datos de Firebase al formato esperado
      const transformedHistory: AnalysisHistoryItem[] = result.history.map(item => {
        // Manejar la fecha de manera segura
        let timestamp: Date;
        try {
          if (item.createdAt instanceof Date) {
            timestamp = item.createdAt;
          } else if (typeof item.createdAt === 'string' || typeof item.createdAt === 'number') {
            timestamp = new Date(item.createdAt);
          } else {
            console.warn('⚠️ Fecha inválida en item:', item.createdAt);
            timestamp = new Date(); // Usar fecha actual como fallback
          }
          
          // Verificar que la fecha sea válida
          if (isNaN(timestamp.getTime())) {
            console.warn('⚠️ Fecha inválida después de conversión:', item.createdAt);
            timestamp = new Date(); // Usar fecha actual como fallback
          }
        } catch (error) {
          console.error('❌ Error procesando fecha:', error, item.createdAt);
          timestamp = new Date(); // Usar fecha actual como fallback
        }
        
        return {
          id: item.id,
          imageData: item.imageData,
          analysisResult: item.analysisResult,
          timestamp: timestamp,
          metadata: item.metadata
        };
      });
      
      console.log('✅ Historial transformado:', transformedHistory);
      
      return {
        history: transformedHistory,
        pagination: result.pagination
      };
    } catch (error) {
      console.error('❌ Error getting history from Firebase:', error);
      console.log('🔄 Intentando fallback a datos locales...');
      // Fallback a datos locales si Firebase falla
      return this.getLocalHistory();
    }
  }

  // Obtener estadísticas desde Firebase
  async getHistoryStats() {
    try {
      return await pestAnalysisService.getAnalysisStats();
    } catch (error) {
      console.error('Error getting stats from Firebase:', error);
      // Fallback a estadísticas locales
      return this.getLocalStats();
    }
  }

  // Guardar análisis (ahora se guarda automáticamente en Firebase)
  saveAnalysis(analysisResult: AnalysisResult, imageData: string) {
    // El análisis ya se guarda automáticamente en Firebase cuando se llama a analyzeImage
    // Solo mantenemos esto para compatibilidad con el código existente
    console.log('Analysis saved to Firebase automatically');
  }

  // Eliminar análisis desde Firebase
  async deleteAnalysis(analysisId: string) {
    try {
      await pestAnalysisService.deleteAnalysis(analysisId);
    } catch (error) {
      console.error('Error deleting analysis from Firebase:', error);
      throw error;
    }
  }

  // Métodos de fallback para datos locales
  private getLocalHistory(): {
    history: AnalysisHistoryItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  } {
    const history = JSON.parse(localStorage.getItem('pestAnalysisHistory') || '[]');
    return {
      history,
      pagination: {
        page: 1,
        limit: 10,
        total: history.length,
        totalPages: Math.ceil(history.length / 10)
      }
    };
  }

  private getLocalStats() {
    const history = JSON.parse(localStorage.getItem('pestAnalysisHistory') || '[]');
    const analyses = history.map((item: any) => item.analysisResult);
    
    return {
      totalAnalyses: analyses.length,
      pestDetections: analyses.filter((a: AnalysisResult) => a.hasPest).length,
      mostCommonPest: null,
      recentAnalyses: 0,
      averageConfidence: 0,
      pestTypesCount: {}
    };
  }

  // Métodos no soportados con Firebase
  importHistory() {
    console.warn('Import history not supported with Firebase backend');
    return false;
  }

  clearHistory() {
    console.warn('Clear history not supported with Firebase backend');
    return false;
  }
}

export const historyService = new HistoryService();
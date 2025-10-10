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
      const transformedHistory: AnalysisHistoryItem[] = result.history.map((item, index) => {
        console.log(`🔍 Procesando item ${index}:`, {
          id: item.id,
          createdAt: item.createdAt,
          createdAtType: typeof item.createdAt,
          createdAtInstance: item.createdAt instanceof Date,
          createdAtKeys: item.createdAt && typeof item.createdAt === 'object' ? Object.keys(item.createdAt) : 'N/A',
          createdAtString: item.createdAt?.toString(),
          createdAtJSON: JSON.stringify(item.createdAt)
        });
        
        // Manejar la fecha de manera segura y robusta
        let timestamp: Date;
        try {
          // Caso 1: Ya es un objeto Date
          if (item.createdAt instanceof Date) {
            timestamp = item.createdAt;
            console.log(`✅ Item ${index} - Usando fecha Date directamente:`, timestamp);
          }
          // Caso 2: Es un string o number
          else if (typeof item.createdAt === 'string' || typeof item.createdAt === 'number') {
            timestamp = new Date(item.createdAt);
            console.log(`✅ Item ${index} - Convertido de string/number:`, timestamp);
          }
          // Caso 3: Es un objeto con método toDate (Firebase Timestamp)
          else if (item.createdAt && typeof item.createdAt === 'object' && 'toDate' in item.createdAt) {
            timestamp = (item.createdAt as any).toDate();
            console.log(`✅ Item ${index} - Convertido de Firebase Timestamp:`, timestamp);
          }
          // Caso 4: Es un objeto con propiedades de fecha (Firebase Timestamp serializado)
          else if (item.createdAt && typeof item.createdAt === 'object' && ('seconds' in item.createdAt || 'nanoseconds' in item.createdAt)) {
            // Intentar convertir desde Firebase Timestamp serializado
            const firebaseTimestamp = item.createdAt as any;
            if (firebaseTimestamp.seconds) {
              timestamp = new Date(firebaseTimestamp.seconds * 1000);
              console.log(`✅ Item ${index} - Convertido de Firebase Timestamp serializado:`, timestamp);
            } else {
              console.warn(`⚠️ Item ${index} - Firebase Timestamp sin seconds:`, item.createdAt);
              timestamp = new Date('2024-01-01T00:00:00Z');
            }
          }
          // Caso 5: Es un objeto con _seconds (otra forma de Firebase Timestamp)
          else if (item.createdAt && typeof item.createdAt === 'object' && '_seconds' in item.createdAt) {
            const firebaseTimestamp = item.createdAt as any;
            timestamp = new Date(firebaseTimestamp._seconds * 1000);
            console.log(`✅ Item ${index} - Convertido de Firebase Timestamp _seconds:`, timestamp);
          }
          // Caso 6: Es null o undefined
          else if (item.createdAt === null || item.createdAt === undefined) {
            console.warn(`⚠️ Item ${index} - Fecha es null/undefined:`, item.createdAt);
            timestamp = new Date('2024-01-01T00:00:00Z'); // Fecha fija de error
          }
          // Caso 7: Otro tipo de objeto - intentar convertir a string primero
          else if (item.createdAt && typeof item.createdAt === 'object') {
            console.warn(`⚠️ Item ${index} - Objeto de fecha no reconocido, intentando conversión:`, item.createdAt);
            try {
              // Intentar convertir el objeto a string y luego a Date
              const dateString = item.createdAt.toString();
              timestamp = new Date(dateString);
              console.log(`✅ Item ${index} - Convertido desde objeto toString:`, timestamp);
            } catch (error) {
              console.error(`❌ Item ${index} - Error en conversión de objeto:`, error);
              timestamp = new Date('2024-01-01T00:00:00Z'); // Fecha fija de error
            }
          }
          // Caso 8: Otro tipo no reconocido
          else {
            console.warn(`⚠️ Item ${index} - Tipo de fecha no reconocido:`, typeof item.createdAt, item.createdAt);
            timestamp = new Date('2024-01-01T00:00:00Z'); // Fecha fija de error
          }
          
          // Verificar que la fecha sea válida
          if (isNaN(timestamp.getTime())) {
            console.warn(`⚠️ Item ${index} - Fecha inválida después de conversión:`, item.createdAt);
            timestamp = new Date('2024-01-01T00:00:00Z'); // Fecha fija de error
          }
          
          console.log(`📅 Item ${index} - Timestamp final:`, timestamp, `(${timestamp.toISOString()})`);
        } catch (error) {
          console.error(`❌ Item ${index} - Error procesando fecha:`, error, item.createdAt);
          timestamp = new Date('2024-01-01T00:00:00Z'); // Fecha fija de error
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
import { AnalysisResult, AnalysisMetadata } from '../types/pestAnalysis';
import { ApiResponse } from '../types/api';
import { API_CONFIG } from '../constants/api';

class PestAnalysisService {
  private apiUrl = API_CONFIG.BASE_URL;

  // Obtener token de Firebase para autenticación
  private async getAuthToken(): Promise<string> {
    console.log('🔍 Verificando usuario autenticado...');
    const { auth } = await import('../firebase/config');
    const user = auth.currentUser;
    console.log('👤 Usuario actual:', user ? `${user.email} (${user.uid})` : 'No autenticado');
    
    if (!user) {
      console.error('❌ No hay usuario autenticado');
      throw new Error('Usuario no autenticado');
    }
    
    console.log('🎫 Obteniendo ID token...');
    try {
      const token = await user.getIdToken();
      console.log('✅ Token obtenido exitosamente, longitud:', token.length);
      return token;
    } catch (error) {
      console.error('❌ Error obteniendo token:', error);
      throw error;
    }
  }

  // Analizar imagen usando el backend con autenticación Firebase
  async analyzeImage(imageFile: File, metadata?: {
    cropType?: string;
    location?: string;
    notes?: string;
    photoTimestamp?: string;
  }): Promise<AnalysisResult> {
    try {
      const token = await this.getAuthToken();
      
      // Crear FormData para enviar la imagen
      const formData = new FormData();
      formData.append('image', imageFile);
      
      if (metadata?.cropType) formData.append('cropType', metadata.cropType);
      if (metadata?.location) formData.append('location', metadata.location);
      if (metadata?.notes) formData.append('notes', metadata.notes);
      if (metadata?.photoTimestamp) formData.append('photoTimestamp', metadata.photoTimestamp);

      console.log('📤 Enviando FormData con metadata:', {
        cropType: metadata?.cropType,
        location: metadata?.location,
        notes: metadata?.notes,
        photoTimestamp: metadata?.photoTimestamp
      });

      const response = await fetch(`${this.apiUrl}${API_CONFIG.ENDPOINTS.ANALYZE}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Error al analizar la imagen');
      }

      const result = await response.json();
      console.log('📊 Resultado completo del backend:', result);
      console.log('🔍 Estructura de result.data:', result.data);
      console.log('🔍 Estructura de result.data.analysis:', result.data?.analysis);
      
      // Verificar la estructura de la respuesta
      if (result.success && result.data && result.data.analysis) {
        // El backend envía el objeto analysis completo, que ya contiene analysisResult
        console.log('✅ Retornando analysisResult:', result.data.analysis.analysisResult);
        console.log('💾 Análisis guardado con ID:', result.data.analysis.id);
        console.log('👤 Usuario ID del análisis:', result.data.analysis.userId);
        return result.data.analysis.analysisResult;
      } else {
        console.error('❌ Estructura de respuesta inesperada:', result);
        throw new Error('Formato de respuesta inesperado del servidor');
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw new Error('Error al analizar la imagen');
    }
  }

  // Obtener historial de análisis con autenticación
  async getAnalysisHistory(page: number = 1, limit: number = 10): Promise<{
    history: Array<{
      id: string;
      imageData: string;
      analysisResult: AnalysisResult;
      createdAt: Date;
      metadata?: any;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      console.log('🔐 Obteniendo token de autenticación...');
      const token = await this.getAuthToken();
      console.log('✅ Token obtenido:', token ? 'Token válido' : 'Sin token');
      
      const url = `${this.apiUrl}${API_CONFIG.ENDPOINTS.HISTORY}?page=${page}&limit=${limit}`;
      console.log('🌐 URL de la API:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      console.log('📡 Respuesta del servidor:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error del servidor:', errorText);
        throw new Error(`Error al obtener el historial: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('📊 Datos recibidos del servidor:', result);
      console.log('📊 Estructura de result.data:', result.data);
      console.log('📊 Historial recibido:', result.data?.history);
      
      if (result.data?.history) {
        result.data.history.forEach((item: any, index: number) => {
          console.log(`📅 Item ${index} del historial:`, {
            id: item.id,
            createdAt: item.createdAt,
            createdAtType: typeof item.createdAt,
            createdAtInstance: item.createdAt instanceof Date
          });
        });
      }
      
      return result.data;
    } catch (error) {
      console.error('❌ Error getting history:', error);
      throw new Error('Error al obtener el historial');
    }
  }

  // Obtener estadísticas con autenticación
  async getAnalysisStats(): Promise<{
    totalAnalyses: number;
    pestDetections: number;
    mostCommonPest: string | null;
    recentAnalyses: number;
    averageConfidence: number;
    pestTypesCount: Record<string, number>;
  }> {
    try {
      const token = await this.getAuthToken();
      
      const response = await fetch(`${this.apiUrl}${API_CONFIG.ENDPOINTS.STATS}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener las estadísticas');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error getting stats:', error);
      throw new Error('Error al obtener las estadísticas');
    }
  }

  // Eliminar análisis con autenticación
  async deleteAnalysis(analysisId: string): Promise<void> {
    try {
      const token = await this.getAuthToken();
      
      const response = await fetch(`${this.apiUrl}${API_CONFIG.ENDPOINTS.DELETE}/${analysisId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el análisis');
      }
    } catch (error) {
      console.error('Error deleting analysis:', error);
      throw new Error('Error al eliminar el análisis');
    }
  }

  // Método para obtener estadísticas de análisis (compatibilidad con código existente)
  getLocalAnalysisStats(analyses: AnalysisResult[]): {
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

  // Eliminar análisis específico
  async deleteAnalysis(analysisId: string): Promise<void> {
    try {
      const token = await this.getAuthToken();
      
      const response = await fetch(`${this.apiUrl}${API_CONFIG.ENDPOINTS.DELETE}/${analysisId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el análisis');
      }

      const result = await response.json();
      console.log('✅ Análisis eliminado:', result);
    } catch (error) {
      console.error('❌ Error deleting analysis:', error);
      throw error;
    }
  }

  // Eliminar análisis antiguos con fechas incorrectas
  async deleteOldAnalyses(): Promise<{ deletedCount: number }> {
    try {
      const token = await this.getAuthToken();
      
      const response = await fetch(`${this.apiUrl}${API_CONFIG.ENDPOINTS.DELETE}/cleanup/old-analyses`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar análisis antiguos');
      }

      const result = await response.json();
      console.log('✅ Análisis antiguos eliminados:', result);
      return result;
    } catch (error) {
      console.error('❌ Error deleting old analyses:', error);
      throw error;
    }
  }
}

export const pestAnalysisService = new PestAnalysisService();
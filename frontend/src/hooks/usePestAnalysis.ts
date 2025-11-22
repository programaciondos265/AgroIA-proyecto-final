import { useState, useCallback } from 'react';
import { pestAnalysisService, AnalysisResult } from '../services/pestAnalysisService';
import { MESSAGES } from '../constants/messages';

interface UsePestAnalysisReturn {
  analyzeImage: (file: File, metadata?: any) => Promise<AnalysisResult | null>;
  isLoading: boolean;
  error: string | null;
}

export const usePestAnalysis = (): UsePestAnalysisReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeImage = useCallback(
    async (file: File, metadata?: any): Promise<AnalysisResult | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await pestAnalysisService.analyzeImage(file, metadata);
        return result;
      } catch (err: any) {
        const errorMessage =
          err.message || MESSAGES.ERROR.NETWORK || MESSAGES.ERROR.UNKNOWN;
        setError(errorMessage);
        console.error('Error analyzing image:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    analyzeImage,
    isLoading,
    error,
  };
};


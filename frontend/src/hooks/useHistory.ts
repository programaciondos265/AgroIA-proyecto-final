import { useState, useEffect, useCallback } from 'react';
import { historyService, AnalysisHistoryItem } from '../services/historyService';
import { MESSAGES } from '../constants/messages';

interface UseHistoryReturn {
  history: AnalysisHistoryItem[];
  isLoading: boolean;
  error: string | null;
  loadHistory: (page?: number, limit?: number) => Promise<void>;
  deleteAnalysis: (id: string) => Promise<boolean>;
  stats: {
    totalAnalyses: number;
    pestDetections: number;
    mostCommonPest: string | null;
    averageConfidence: number;
  } | null;
}

export const useHistory = (): UseHistoryReturn => {
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<UseHistoryReturn['stats']>(null);

  const loadHistory = useCallback(async (page: number = 1, limit: number = 10) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await historyService.getHistory(page, limit);
      setHistory(result.history);
    } catch (err: any) {
      const errorMessage =
        err.message || MESSAGES.ERROR.NETWORK || MESSAGES.ERROR.UNKNOWN;
      setError(errorMessage);
      console.error('Error loading history:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteAnalysis = useCallback(async (id: string): Promise<boolean> => {
    try {
      await historyService.deleteAnalysis(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
      return true;
    } catch (err: any) {
      const errorMessage =
        err.message || MESSAGES.ERROR.NETWORK || MESSAGES.ERROR.UNKNOWN;
      setError(errorMessage);
      console.error('Error deleting analysis:', err);
      return false;
    }
  }, []);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const statsData = await historyService.getStats();
        setStats(statsData);
      } catch (err) {
        console.error('Error loading stats:', err);
      }
    };

    loadStats();
  }, [history]);

  return {
    history,
    isLoading,
    error,
    loadHistory,
    deleteAnalysis,
    stats,
  };
};


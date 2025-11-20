// Constantes de API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  ENDPOINTS: {
    ANALYZE: '/pest-analysis/analyze',
    HISTORY: '/pest-analysis/history',
    STATS: '/pest-analysis/stats',
    DELETE: '/pest-analysis',
  },
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
} as const;


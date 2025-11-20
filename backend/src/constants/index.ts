// Constantes del backend
export const FILE_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const API_MESSAGES = {
  SUCCESS: {
    ANALYSIS_CREATED: 'Análisis completado exitosamente',
    ANALYSIS_DELETED: 'Análisis eliminado exitosamente',
    HISTORY_RETRIEVED: 'Historial obtenido exitosamente',
    STATS_RETRIEVED: 'Estadísticas obtenidas exitosamente',
  },
  ERROR: {
    UNAUTHORIZED: 'Token de autorización requerido',
    INVALID_TOKEN: 'Token inválido',
    FILE_REQUIRED: 'No se proporcionó ninguna imagen',
    INVALID_FILE_TYPE: 'Solo se permiten archivos de imagen',
    FILE_TOO_LARGE: 'El archivo es demasiado grande',
    ANALYSIS_NOT_FOUND: 'Análisis no encontrado',
    FIREBASE_NOT_CONFIGURED: 'Firebase no está configurado correctamente',
  },
} as const;


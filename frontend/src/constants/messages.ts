// Mensajes de la aplicación
export const MESSAGES = {
  ERROR: {
    NETWORK: 'Error de conexión. Por favor verifica tu internet.',
    UNAUTHORIZED: 'No estás autenticado. Por favor inicia sesión.',
    FORBIDDEN: 'No tienes permisos para realizar esta acción.',
    NOT_FOUND: 'Recurso no encontrado.',
    SERVER: 'Error del servidor. Por favor intenta más tarde.',
    UNKNOWN: 'Ha ocurrido un error inesperado.',
  },
  SUCCESS: {
    ANALYSIS_CREATED: 'Análisis creado exitosamente',
    ANALYSIS_DELETED: 'Análisis eliminado exitosamente',
    PROFILE_UPDATED: 'Perfil actualizado exitosamente',
  },
  VALIDATION: {
    REQUIRED_FIELD: 'Este campo es requerido',
    INVALID_EMAIL: 'Por favor ingresa un email válido',
    PASSWORD_TOO_SHORT: 'La contraseña debe tener al menos 6 caracteres',
    FILE_TOO_LARGE: 'El archivo es demasiado grande',
    INVALID_FILE_TYPE: 'Tipo de archivo no válido',
  },
} as const;


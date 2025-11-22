/**
 * Formatea una fecha en formato español
 * @param date - Fecha a formatear
 * @returns Fecha formateada como string
 */
export const formatDateTime = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return date.toLocaleDateString('es-ES', options);
};


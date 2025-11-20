import { useAuth as useAuthContext } from '../contexts/AuthContext';

/**
 * Hook personalizado que re-exporta useAuth del contexto
 * para mantener consistencia en la API
 */
export const useAuth = useAuthContext;


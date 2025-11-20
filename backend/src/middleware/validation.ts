import { Request, Response, NextFunction } from 'express';

/**
 * Valida que el cuerpo de la petición contenga los campos requeridos
 */
export const validateRequiredFields = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const missingFields: string[] = [];

    for (const field of fields) {
      if (!req.body[field] && req.body[field] !== 0 && req.body[field] !== false) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Campos requeridos faltantes: ${missingFields.join(', ')}`,
        missingFields,
      });
    }

    next();
  };
};

/**
 * Valida que un campo sea un email válido
 */
export const validateEmail = (field: string = 'email') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const email = req.body[field];

    if (email && typeof email === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: `El campo ${field} debe ser un email válido`,
        });
      }
    }

    next();
  };
};

/**
 * Valida que un campo sea un número
 */
export const validateNumber = (field: string, min?: number, max?: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const value = req.body[field];

    if (value !== undefined) {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        return res.status(400).json({
          success: false,
          message: `El campo ${field} debe ser un número`,
        });
      }

      if (min !== undefined && numValue < min) {
        return res.status(400).json({
          success: false,
          message: `El campo ${field} debe ser mayor o igual a ${min}`,
        });
      }

      if (max !== undefined && numValue > max) {
        return res.status(400).json({
          success: false,
          message: `El campo ${field} debe ser menor o igual a ${max}`,
        });
      }
    }

    next();
  };
};

/**
 * Valida que un campo tenga una longitud específica
 */
export const validateLength = (field: string, min?: number, max?: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const value = req.body[field];

    if (value !== undefined && typeof value === 'string') {
      if (min !== undefined && value.length < min) {
        return res.status(400).json({
          success: false,
          message: `El campo ${field} debe tener al menos ${min} caracteres`,
        });
      }

      if (max !== undefined && value.length > max) {
        return res.status(400).json({
          success: false,
          message: `El campo ${field} debe tener máximo ${max} caracteres`,
        });
      }
    }

    next();
  };
};

/**
 * Valida parámetros de query para paginación
 */
export const validatePagination = (req: Request, res: Response, next: NextFunction) => {
  const { page, limit } = req.query;

  if (page && isNaN(Number(page))) {
    return res.status(400).json({
      success: false,
      message: 'El parámetro page debe ser un número',
    });
  }

  if (limit && isNaN(Number(limit))) {
    return res.status(400).json({
      success: false,
      message: 'El parámetro limit debe ser un número',
    });
  }

  if (page && Number(page) < 1) {
    return res.status(400).json({
      success: false,
      message: 'El parámetro page debe ser mayor a 0',
    });
  }

  if (limit && (Number(limit) < 1 || Number(limit) > 100)) {
    return res.status(400).json({
      success: false,
      message: 'El parámetro limit debe estar entre 1 y 100',
    });
  }

  next();
};


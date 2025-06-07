import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';
import { TaskPriorityValue } from '../../../domain/value-objects/TaskPriority';

export class ValidationMiddleware {
  public static validateCreateTask() {
    return [
      body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
      body('description')
        .trim()
        .notEmpty().withMessage('Description is required'),
      body('completed')
        .notEmpty().withMessage('Completed status is required')
        .isBoolean().withMessage('Completed must be a boolean value (true or false)'),
      body('priority')
        .optional()
        .isIn(Object.values(TaskPriorityValue))
        .withMessage(`Priority must be one of: ${Object.values(TaskPriorityValue).join(', ')}`),
      ValidationMiddleware.handleValidationErrors
    ];
  }

  public static validateUpdateTask() {
    return [
      param('id').isMongoId().withMessage('Invalid task ID format'),
      body('title')
        .optional()
        .trim()
        .notEmpty().withMessage('Title cannot be empty')
        .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
      body('description')
        .optional()
        .trim()
        .notEmpty().withMessage('Description cannot be empty'),
      body('completed')
        .optional()
        .isBoolean().withMessage('Completed must be a boolean value (true or false)'),
      body('priority')
        .optional()
        .isIn(Object.values(TaskPriorityValue))
        .withMessage(`Priority must be one of: ${Object.values(TaskPriorityValue).join(', ')}`),
      ValidationMiddleware.handleValidationErrors
    ];
  }

  public static validateTaskId() {
    return [
      param('id').isMongoId().withMessage('Invalid task ID format'),
      ValidationMiddleware.handleValidationErrors
    ];
  }

  public static handleValidationErrors(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: {
          message: 'Validation error',
          details: errors.array(),
          status: 400,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    next();
  }

  public static validateRequest(schema: any) {
    return (req: Request, res: Response, next: NextFunction) => {
      const errors: string[] = [];
      
      for (const field in schema) {
        const rules = schema[field];
        const value = req.body[field];
        
        // Verificar si el campo es requerido
        if (rules.required && (value === undefined || value === null || value === '')) {
          errors.push(`${field} is required`);
          continue;
        }
        
        // Si el campo no es requerido y está vacío, saltar validaciones
        if (!rules.required && (value === undefined || value === null || value === '')) {
          continue;
        }
        
        // Verificar tipo
        if (rules.type && typeof value !== rules.type) {
          errors.push(`${field} must be of type ${rules.type}`);
          continue;
        }
        
        // Verificar longitud mínima
        if (rules.minLength && value.length < rules.minLength) {
          errors.push(`${field} must be at least ${rules.minLength} characters long`);
        }
        
        // Verificar longitud máxima
        if (rules.maxLength && value.length > rules.maxLength) {
          errors.push(`${field} must be at most ${rules.maxLength} characters long`);
        }
        
        // Verificar patrón
        if (rules.pattern && !rules.pattern.test(value)) {
          errors.push(`${field} format is invalid`);
        }
      }
      
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Validation failed',
            details: errors,
            code: 'VALIDATION_ERROR'
          }
        });
      }
      
      next();
    };
  }
}
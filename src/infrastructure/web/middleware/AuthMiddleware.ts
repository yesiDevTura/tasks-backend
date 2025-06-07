import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../auth/AuthService';
import { Logger } from '../../logging/Logger';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role?: string;
      };
    }
  }
}

export class AuthMiddleware {
  private static readonly logger = Logger.getInstance();

  public static authenticate(req: Request, res: Response, next: NextFunction): void {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        AuthMiddleware.logger.warn('Authentication failed: No authorization header', {
          path: req.path,
          method: req.method
        });
        
        res.status(401).json({
          success: false,
          error: {
            message: 'Access token is required',
            code: 'MISSING_TOKEN'
          }
        });
        return;
      }

      if (!authHeader.startsWith('Bearer ')) {
        AuthMiddleware.logger.warn('Authentication failed: Invalid token format', {
          path: req.path,
          method: req.method
        });
        
        res.status(401).json({
          success: false,
          error: {
            message: 'Invalid token format. Use Bearer token',
            code: 'INVALID_TOKEN_FORMAT'
          }
        });
        return;
      }

      const token = authHeader.split(' ')[1];
      
      if (!token) {
        res.status(401).json({
          success: false,
          error: {
            message: 'Access token is required',
            code: 'MISSING_TOKEN'
          }
        });
        return;
      }

      const decoded = AuthService.verifyToken(token);
      req.user = decoded;
      
      AuthMiddleware.logger.debug('User authenticated successfully', {
        userId: decoded.userId,
        path: req.path,
        method: req.method
      });
      
      next();
    } catch (error: any) {
      AuthMiddleware.logger.warn('Authentication failed: Invalid token', {
        error: error.message,
        path: req.path,
        method: req.method
      });

      res.status(401).json({
        success: false,
        error: {
          message: 'Invalid or expired token',
          code: 'INVALID_TOKEN'
        }
      });
    }
  }

  public static optionalAuthenticate(req: Request, res: Response, next: NextFunction): void {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader?.startsWith('Bearer ')) {
        // Si no hay token, continúa sin autenticar
        next();
        return;
      }

      const token = authHeader.split(' ')[1];
      
      if (token) {
        const decoded = AuthService.verifyToken(token);
        req.user = decoded;
      }
      
      next();
    } catch (error: any) {
      // En autenticación opcional, si el token es inválido, simplemente continuamos sin user
      AuthMiddleware.logger.debug('Optional authentication failed', { error: error.message });
      next();
    }
  }
}
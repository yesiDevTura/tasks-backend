import { Request, Response, NextFunction } from 'express';
import { Logger } from '../../logging/Logger';

export class LoggingMiddleware {
  private static logger = Logger.getInstance();

  public static logRequest(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();
    
    // Log the request
    LoggingMiddleware.logger.info(`${req.method} ${req.url}`, {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });

    // Create a function to log the response
    const logResponse = () => {
      const duration = Date.now() - start;
      
      LoggingMiddleware.logger.info(`${req.method} ${req.url} ${res.statusCode}`, {
        method: req.method,
        url: req.url,
        status: res.statusCode,
        duration: `${duration}ms`,
      });
    };

    // Log the response when it's sent
    res.on('finish', logResponse);
    
    next();
  }
}
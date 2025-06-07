import { Request, Response, NextFunction } from 'express';
import { TaskNotFoundException } from '../../../domain/exceptions/TaskNotFoundException';
import { InvalidTaskDataException } from '../../../domain/exceptions/InvalidTaskDataException';
import { Logger } from '../../logging/Logger';

export class ErrorHandler {
  private static logger = Logger.getInstance();

  public static handle(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    let statusCode = 500;
    let errorMessage = 'Internal server error';
    let errorDetails: any = {};

    if (err instanceof TaskNotFoundException) {
      statusCode = 404;
      errorMessage = err.message;
    } else if (err instanceof InvalidTaskDataException) {
      statusCode = 400;
      errorMessage = err.message;
    } else if (err instanceof SyntaxError) {
      statusCode = 400;
      errorMessage = 'Invalid JSON format';
    }

    // Add request information for logging
    errorDetails = {
      path: req.path,
      method: req.method,
      ip: req.ip,
      timestamp: new Date().toISOString()
    };

    // Log the error with stack trace in development
    if (process.env.NODE_ENV !== 'production') {
      errorDetails.stack = err.stack;
    }

    // Log the error
    ErrorHandler.logger.error(errorMessage, { 
      error: err,
      request: errorDetails
    });

    // Send the response
    res.status(statusCode).json({
      error: {
        message: errorMessage,
        status: statusCode,
        timestamp: new Date().toISOString()
      }
    });
  }
}
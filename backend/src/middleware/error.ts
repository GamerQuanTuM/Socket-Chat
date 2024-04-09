import { type Request, type Response, type NextFunction } from 'express';

// Define a custom error class
export class CustomError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = this.constructor.name;
  }
}

// Error middleware function
export function errorHandler(err: CustomError, req: Request, res: Response, next: NextFunction) {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message: err.message
  });
}
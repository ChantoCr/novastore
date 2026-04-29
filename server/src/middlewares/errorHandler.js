import { errorResponse } from '../utils/apiResponse.js';
import { AppError } from '../utils/appError.js';

export function notFoundHandler(_req, res) {
  res.status(404).json(
    errorResponse({
      message: 'Route not found',
    }),
  );
}

export function errorHandler(error, _req, res, next) {
  void next;
  if (error instanceof AppError) {
    return res.status(error.statusCode).json(
      errorResponse({
        message: error.message,
        errors: error.errors,
      }),
    );
  }

  console.error(error);

  return res.status(500).json(
    errorResponse({
      message: 'Internal server error',
      errors:
        process.env.NODE_ENV === 'development'
          ? [{ detail: error.message }]
          : [],
    }),
  );
}

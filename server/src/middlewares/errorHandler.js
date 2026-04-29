import { errorResponse } from '../utils/apiResponse.js';

export function notFoundHandler(_req, res) {
  res.status(404).json(
    errorResponse({
      message: 'Route not found',
    }),
  );
}

export function errorHandler(error, _req, res, _next) {
  console.error(error);

  res.status(500).json(
    errorResponse({
      message: 'Internal server error',
      errors:
        process.env.NODE_ENV === 'development'
          ? [{ detail: error.message }]
          : [],
    }),
  );
}

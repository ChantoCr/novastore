import { ZodError } from 'zod';

import { AppError } from '../utils/appError.js';

function formatZodIssues(issues) {
  return issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));
}

export function validateRequest({ body, params, query }) {
  return function requestValidator(req, _res, next) {
    try {
      if (body) {
        req.body = body.parse(req.body);
      }

      if (params) {
        req.params = params.parse(req.params);
      }

      if (query) {
        req.query = query.parse(req.query);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(new AppError('Validation failed', 400, formatZodIssues(error.issues)));
      }

      return next(error);
    }
  };
}

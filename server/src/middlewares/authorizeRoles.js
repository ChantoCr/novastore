import { AppError } from '../utils/appError.js';

export function authorizeRoles(...allowedRoles) {
  return function roleAuthorizer(req, _res, next) {
    const userRoles = req.user?.roles || [];
    const isAllowed = allowedRoles.some((role) => userRoles.includes(role));

    if (!isAllowed) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    return next();
  };
}

import { AppError } from '../utils/appError.js';
import { verifyAccessToken } from '../utils/jwt.js';

export function authenticateToken(req, _res, next) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    return next(new AppError('Authentication required', 401));
  }

  const token = authorization.replace('Bearer ', '').trim();

  try {
    const payload = verifyAccessToken(token);

    req.user = {
      id: Number(payload.sub),
      email: payload.email,
      roles: payload.roles || [],
    };

    return next();
  } catch {
    return next(new AppError('Invalid or expired access token', 401));
  }
}

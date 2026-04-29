import crypto from 'node:crypto';

import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';

export function generateAccessToken(user) {
  return jwt.sign(
    {
      sub: String(user.id),
      email: user.email,
      roles: user.roles,
      type: 'access',
    },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: env.ACCESS_TOKEN_TTL,
    },
  );
}

export function generateRefreshToken(user) {
  return jwt.sign(
    {
      sub: String(user.id),
      type: 'refresh',
    },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: env.REFRESH_TOKEN_TTL,
    },
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
}

export function getTokenExpiryDate(token) {
  const decoded = jwt.decode(token);

  if (!decoded || typeof decoded !== 'object' || !decoded.exp) {
    return null;
  }

  return new Date(decoded.exp * 1000);
}

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

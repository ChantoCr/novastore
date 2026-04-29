import bcrypt from 'bcrypt';

import {
  createRefreshTokenRecord,
  findActiveRefreshTokenRecord,
  revokeRefreshTokenByHash,
} from '../repositories/refreshToken.repository.js';
import {
  assignRoleToUser,
  createUser,
  findUserWithRolesByEmail,
  findUserWithRolesById,
} from '../repositories/user.repository.js';
import { AppError } from '../utils/appError.js';
import {
  generateAccessToken,
  generateRefreshToken,
  getTokenExpiryDate,
  hashToken,
  verifyRefreshToken,
} from '../utils/jwt.js';
import { env } from '../config/env.js';

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    isActive: user.isActive,
    roles: user.roles,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function issueAuthTokens(user) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  const refreshTokenHash = hashToken(refreshToken);
  const expiresAt = getTokenExpiryDate(refreshToken);

  if (!expiresAt) {
    throw new AppError('Failed to determine refresh token expiry', 500);
  }

  await createRefreshTokenRecord({
    userId: user.id,
    tokenHash: refreshTokenHash,
    expiresAt,
  });

  return {
    accessToken,
    refreshToken,
  };
}

export async function registerUser(payload) {
  const existingUser = await findUserWithRolesByEmail(payload.email);

  if (existingUser) {
    throw new AppError('An account with this email already exists', 409);
  }

  const passwordHash = await bcrypt.hash(payload.password, env.BCRYPT_SALT_ROUNDS);
  const userId = await createUser({
    name: payload.name,
    email: payload.email,
    passwordHash,
  });

  await assignRoleToUser(userId, 'user');

  const user = await findUserWithRolesById(userId);

  if (!user) {
    throw new AppError('User was created but could not be loaded', 500);
  }

  const tokens = await issueAuthTokens(user);

  return {
    user: sanitizeUser(user),
    ...tokens,
  };
}

export async function loginUser(payload) {
  const user = await findUserWithRolesByEmail(payload.email);

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  if (!user.isActive) {
    throw new AppError('This account is inactive', 403);
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401);
  }

  const tokens = await issueAuthTokens(user);

  return {
    user: sanitizeUser(user),
    ...tokens,
  };
}

export async function refreshUserToken(refreshToken) {
  let payload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  const userId = Number(payload.sub);
  const tokenHash = hashToken(refreshToken);

  const tokenRecord = await findActiveRefreshTokenRecord({ userId, tokenHash });

  if (!tokenRecord) {
    throw new AppError('Refresh token is no longer valid', 401);
  }

  await revokeRefreshTokenByHash({ userId, tokenHash });

  const user = await findUserWithRolesById(userId);

  if (!user || !user.isActive) {
    throw new AppError('User account is not available', 401);
  }

  const tokens = await issueAuthTokens(user);

  return {
    user: sanitizeUser(user),
    ...tokens,
  };
}

export async function logoutUser(refreshToken) {
  try {
    const payload = verifyRefreshToken(refreshToken);
    const userId = Number(payload.sub);
    const tokenHash = hashToken(refreshToken);

    await revokeRefreshTokenByHash({ userId, tokenHash });
  } catch {
    return {
      success: true,
    };
  }

  return {
    success: true,
  };
}

export async function getCurrentUser(userId) {
  const user = await findUserWithRolesById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return sanitizeUser(user);
}

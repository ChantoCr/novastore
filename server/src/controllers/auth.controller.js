import { successResponse } from '../utils/apiResponse.js';
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshUserToken,
  registerUser,
} from '../services/auth.service.js';

export async function register(req, res) {
  const data = await registerUser(req.body);

  res.status(201).json(
    successResponse({
      message: 'Account created successfully',
      data,
    }),
  );
}

export async function login(req, res) {
  const data = await loginUser(req.body);

  res.status(200).json(
    successResponse({
      message: 'Login successful',
      data,
    }),
  );
}

export async function refresh(req, res) {
  const data = await refreshUserToken(req.body.refreshToken);

  res.status(200).json(
    successResponse({
      message: 'Token refreshed successfully',
      data,
    }),
  );
}

export async function logout(req, res) {
  await logoutUser(req.body.refreshToken);

  res.status(200).json(
    successResponse({
      message: 'Logout successful',
    }),
  );
}

export async function me(req, res) {
  const user = await getCurrentUser(req.user.id);

  res.status(200).json(
    successResponse({
      message: 'Authenticated user loaded successfully',
      data: user,
    }),
  );
}

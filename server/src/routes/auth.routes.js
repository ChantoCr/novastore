import { Router } from 'express';

import { login, logout, me, refresh, register } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  loginSchema,
  logoutSchema,
  refreshTokenSchema,
  registerSchema,
} from '../validators/auth.validators.js';

const authRouter = Router();

authRouter.post('/register', validateRequest({ body: registerSchema }), asyncHandler(register));
authRouter.post('/login', validateRequest({ body: loginSchema }), asyncHandler(login));
authRouter.post('/refresh', validateRequest({ body: refreshTokenSchema }), asyncHandler(refresh));
authRouter.post('/logout', validateRequest({ body: logoutSchema }), asyncHandler(logout));
authRouter.get('/me', authenticateToken, asyncHandler(me));

export default authRouter;

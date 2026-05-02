import { Router } from 'express';

import { createCheckout } from '../controllers/checkout.controller.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createCheckoutSchema } from '../validators/checkout.validators.js';

const checkoutRouter = Router();

checkoutRouter.post(
  '/',
  authenticateToken,
  validateRequest({ body: createCheckoutSchema }),
  asyncHandler(createCheckout),
);

export default checkoutRouter;

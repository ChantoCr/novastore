import { Router } from 'express';

import {
  addWishlistItem,
  listWishlist,
  removeWishlistItem,
} from '../controllers/wishlist.controller.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  wishlistProductBodySchema,
  wishlistProductParamsSchema,
} from '../validators/wishlist.validators.js';

const wishlistRouter = Router();

wishlistRouter.use(authenticateToken);

wishlistRouter.get('/', asyncHandler(listWishlist));
wishlistRouter.post('/', validateRequest({ body: wishlistProductBodySchema }), asyncHandler(addWishlistItem));
wishlistRouter.delete(
  '/:productId',
  validateRequest({ params: wishlistProductParamsSchema }),
  asyncHandler(removeWishlistItem),
);

export default wishlistRouter;

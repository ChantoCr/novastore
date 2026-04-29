import { Router } from 'express';

import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from '../controllers/product.controller.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  createProductSchema,
  listProductsQuerySchema,
  productIdentifierSchema,
  updateProductSchema,
} from '../validators/product.validators.js';

const productRouter = Router();

productRouter.get('/', validateRequest({ query: listProductsQuerySchema }), asyncHandler(listProducts));
productRouter.get(
  '/:productIdOrSlug',
  validateRequest({ params: productIdentifierSchema }),
  asyncHandler(getProduct),
);

productRouter.post(
  '/',
  authenticateToken,
  authorizeRoles('admin'),
  validateRequest({ body: createProductSchema }),
  asyncHandler(createProduct),
);

productRouter.patch(
  '/:productIdOrSlug',
  authenticateToken,
  authorizeRoles('admin'),
  validateRequest({ params: productIdentifierSchema, body: updateProductSchema }),
  asyncHandler(updateProduct),
);

productRouter.delete(
  '/:productIdOrSlug',
  authenticateToken,
  authorizeRoles('admin'),
  validateRequest({ params: productIdentifierSchema }),
  asyncHandler(deleteProduct),
);

export default productRouter;

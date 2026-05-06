import { Router } from 'express';

import {
  adjustProductStock,
  createProduct,
  deleteProduct,
  getProduct,
  listManagedProducts,
  listProducts,
  updateProduct,
  uploadProductImage,
} from '../controllers/product.controller.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';
import { uploadProductImage as uploadProductImageMiddleware } from '../middlewares/uploadProductImage.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  adjustStockSchema,
  createProductSchema,
  listManagedProductsQuerySchema,
  listProductsQuerySchema,
  productIdentifierSchema,
  updateProductSchema,
  uploadProductImageSchema,
} from '../validators/product.validators.js';

const productRouter = Router();

productRouter.get('/', validateRequest({ query: listProductsQuerySchema }), asyncHandler(listProducts));
productRouter.get(
  '/manage',
  authenticateToken,
  authorizeRoles('admin'),
  validateRequest({ query: listManagedProductsQuerySchema }),
  asyncHandler(listManagedProducts),
);
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
  '/:productIdOrSlug/stock',
  authenticateToken,
  authorizeRoles('admin'),
  validateRequest({ params: productIdentifierSchema, body: adjustStockSchema }),
  asyncHandler(adjustProductStock),
);

productRouter.post(
  '/:productIdOrSlug/images',
  authenticateToken,
  authorizeRoles('admin'),
  uploadProductImageMiddleware,
  validateRequest({ params: productIdentifierSchema, body: uploadProductImageSchema }),
  asyncHandler(uploadProductImage),
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

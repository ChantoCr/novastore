import { Router } from 'express';

import {
  createCategory,
  listCategories,
  listManagedCategories,
  updateCategory,
} from '../controllers/category.controller.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  categoryIdentifierSchema,
  createCategorySchema,
  listManagedCategoriesQuerySchema,
  updateCategorySchema,
} from '../validators/category.validators.js';

const categoryRouter = Router();

categoryRouter.get('/', asyncHandler(listCategories));

categoryRouter.get(
  '/manage',
  authenticateToken,
  authorizeRoles('admin'),
  validateRequest({ query: listManagedCategoriesQuerySchema }),
  asyncHandler(listManagedCategories),
);

categoryRouter.post(
  '/',
  authenticateToken,
  authorizeRoles('admin'),
  validateRequest({ body: createCategorySchema }),
  asyncHandler(createCategory),
);

categoryRouter.patch(
  '/:categoryIdOrSlug',
  authenticateToken,
  authorizeRoles('admin'),
  validateRequest({ params: categoryIdentifierSchema, body: updateCategorySchema }),
  asyncHandler(updateCategory),
);

export default categoryRouter;

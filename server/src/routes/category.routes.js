import { Router } from 'express';

import { listCategories } from '../controllers/category.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const categoryRouter = Router();

categoryRouter.get('/', asyncHandler(listCategories));

export default categoryRouter;

import { Router } from 'express';

import healthRouter from './health.routes.js';
import productRouter from './product.routes.js';

const router = Router();

router.use('/', healthRouter);
router.use('/products', productRouter);

router.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'NOVA Store API root',
    data: {
      availableRoutes: [
        '/api/health',
        '/api/health/db',
        '/api/products',
        '/api/products/:productIdOrSlug',
        '/api/auth/register',
        '/api/auth/login',
        '/api/auth/refresh',
        '/api/auth/logout',
        '/api/auth/me',
      ],
    },
  });
});

export default router;

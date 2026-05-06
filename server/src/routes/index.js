import { Router } from 'express';

import auditRouter from './audit.routes.js';
import categoryRouter from './category.routes.js';
import checkoutRouter from './checkout.routes.js';
import healthRouter from './health.routes.js';
import orderRouter from './order.routes.js';
import productRouter from './product.routes.js';
import wishlistRouter from './wishlist.routes.js';

const router = Router();

router.use('/', healthRouter);
router.use('/categories', categoryRouter);
router.use('/checkout', checkoutRouter);
router.use('/orders', orderRouter);
router.use('/products', productRouter);
router.use('/wishlist', wishlistRouter);
router.use('/audit-logs', auditRouter);

router.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'NOVA Store API root',
    data: {
      availableRoutes: [
        '/api/health',
        '/api/health/db',
        '/api/categories',
        '/api/categories/manage',
        '/api/checkout',
        '/api/orders',
        '/api/orders/:orderId',
        '/api/orders/admin',
        '/api/orders/admin/:orderId',
        '/api/orders/admin/:orderId/status',
        '/api/audit-logs',
        '/api/products',
        '/api/products/manage',
        '/api/products/:productIdOrSlug',
        '/api/wishlist',
        '/api/wishlist/:productId',
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

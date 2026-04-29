import { Router } from 'express';

import healthRouter from './health.routes.js';

const router = Router();

router.use('/', healthRouter);

router.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'NOVA Store API root',
    data: {
      availableRoutes: ['/api/health', '/api/health/db'],
    },
  });
});

export default router;

import { Router } from 'express';

import { getApiHealth, getDatabaseHealth } from '../controllers/health.controller.js';

const healthRouter = Router();

healthRouter.get('/health', getApiHealth);
healthRouter.get('/health/db', getDatabaseHealth);

export default healthRouter;

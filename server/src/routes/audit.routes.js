import { Router } from 'express';

import { listAuditLogs } from '../controllers/audit.controller.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { listAuditLogsQuerySchema } from '../validators/audit.validators.js';

const auditRouter = Router();

auditRouter.get(
  '/',
  authenticateToken,
  authorizeRoles('admin'),
  validateRequest({ query: listAuditLogsQuerySchema }),
  asyncHandler(listAuditLogs),
);

export default auditRouter;

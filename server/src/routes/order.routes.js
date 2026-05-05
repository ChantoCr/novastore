import { Router } from 'express';

import {
  getAdminOrder,
  getMyOrder,
  listAdminOrders,
  listMyOrders,
  updateAdminOrderStatus,
} from '../controllers/order.controller.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  listAdminOrdersQuerySchema,
  listOrdersQuerySchema,
  orderIdentifierSchema,
  updateAdminOrderStatusSchema,
} from '../validators/order.validators.js';

const orderRouter = Router();

orderRouter.use(authenticateToken);

orderRouter.get('/', validateRequest({ query: listOrdersQuerySchema }), asyncHandler(listMyOrders));
orderRouter.get(
  '/admin',
  authorizeRoles('admin'),
  validateRequest({ query: listAdminOrdersQuerySchema }),
  asyncHandler(listAdminOrders),
);
orderRouter.get(
  '/admin/:orderId',
  authorizeRoles('admin'),
  validateRequest({ params: orderIdentifierSchema }),
  asyncHandler(getAdminOrder),
);
orderRouter.patch(
  '/admin/:orderId/status',
  authorizeRoles('admin'),
  validateRequest({ params: orderIdentifierSchema, body: updateAdminOrderStatusSchema }),
  asyncHandler(updateAdminOrderStatus),
);
orderRouter.get(
  '/:orderId',
  validateRequest({ params: orderIdentifierSchema }),
  asyncHandler(getMyOrder),
);

export default orderRouter;

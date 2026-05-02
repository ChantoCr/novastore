import { Router } from 'express';

import { getMyOrder, listMyOrders } from '../controllers/order.controller.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { listOrdersQuerySchema, orderIdentifierSchema } from '../validators/order.validators.js';

const orderRouter = Router();

orderRouter.use(authenticateToken);

orderRouter.get('/', validateRequest({ query: listOrdersQuerySchema }), asyncHandler(listMyOrders));
orderRouter.get(
  '/:orderId',
  validateRequest({ params: orderIdentifierSchema }),
  asyncHandler(getMyOrder),
);

export default orderRouter;

import { successResponse } from '../utils/apiResponse.js';
import { getOrderForUser, getOrdersForUser } from '../services/order.service.js';

export async function listMyOrders(req, res) {
  const data = await getOrdersForUser(req.user.id, req.query);

  res.status(200).json(
    successResponse({
      message: 'Orders loaded successfully',
      data,
    }),
  );
}

export async function getMyOrder(req, res) {
  const data = await getOrderForUser(req.user.id, req.params.orderId);

  res.status(200).json(
    successResponse({
      message: 'Order loaded successfully',
      data,
    }),
  );
}

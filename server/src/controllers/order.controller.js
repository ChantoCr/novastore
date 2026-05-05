import { successResponse } from '../utils/apiResponse.js';
import {
  getOrderForAdmin,
  getOrderForUser,
  getOrdersForAdmin,
  getOrdersForUser,
  updateOrderStatusForAdmin,
} from '../services/order.service.js';

function buildActorContext(req) {
  return {
    adminUserId: req.user.id,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
  };
}

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

export async function listAdminOrders(req, res) {
  const data = await getOrdersForAdmin(req.query);

  res.status(200).json(
    successResponse({
      message: 'Admin orders loaded successfully',
      data,
    }),
  );
}

export async function getAdminOrder(req, res) {
  const data = await getOrderForAdmin(req.params.orderId);

  res.status(200).json(
    successResponse({
      message: 'Admin order loaded successfully',
      data,
    }),
  );
}

export async function updateAdminOrderStatus(req, res) {
  const data = await updateOrderStatusForAdmin(req.params.orderId, req.body, buildActorContext(req));

  res.status(200).json(
    successResponse({
      message: 'Order status updated successfully',
      data,
    }),
  );
}

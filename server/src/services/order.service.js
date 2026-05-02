import {
  countOrdersByUser,
  findOrderByIdForUser,
  getOrderMetricsByUser,
  listOrderItemsByOrderId,
  listOrdersByUser,
} from '../repositories/order.repository.js';
import { AppError } from '../utils/appError.js';

export async function getOrdersForUser(userId, query) {
  const page = query.page || 1;
  const limit = query.limit || 6;
  const status = query.status || 'all';

  const [items, totalItems, summary] = await Promise.all([
    listOrdersByUser({ userId, page, limit, status }),
    countOrdersByUser({ userId, status }),
    getOrderMetricsByUser(userId),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / limit)),
    },
    filters: {
      status,
    },
    summary,
  };
}

export async function getOrderForUser(userId, orderId) {
  const order = await findOrderByIdForUser(orderId, userId);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  const items = await listOrderItemsByOrderId(orderId);

  return {
    ...order,
    items,
  };
}

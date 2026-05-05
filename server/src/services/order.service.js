import { createAuditLogRecord } from '../repositories/audit.repository.js';
import { dbPool } from '../config/db.js';
import {
  countOrdersByUser,
  countOrdersForAdmin,
  findOrderByIdForAdmin,
  findOrderByIdForUser,
  getOrderMetricsByUser,
  getOrderMetricsForAdmin,
  listOrderItemsByOrderId,
  listOrdersByUser,
  listOrdersForAdmin,
  updateOrderStatusById,
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

export async function getOrdersForAdmin(query) {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const status = query.status || 'all';
  const paymentStatus = query.paymentStatus || 'all';
  const search = query.search?.trim() || '';

  const [items, totalItems, summary] = await Promise.all([
    listOrdersForAdmin({ page, limit, status, paymentStatus, search }),
    countOrdersForAdmin({ status, paymentStatus, search }),
    getOrderMetricsForAdmin(),
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
      paymentStatus,
      search,
    },
    summary,
  };
}

export async function getOrderForAdmin(orderId) {
  const order = await findOrderByIdForAdmin(orderId);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  const items = await listOrderItemsByOrderId(orderId);

  return {
    ...order,
    items,
  };
}

export async function updateOrderStatusForAdmin(orderId, payload, actor) {
  const connection = await dbPool.getConnection();

  try {
    await connection.beginTransaction();

    const currentOrder = await findOrderByIdForAdmin(orderId);

    if (!currentOrder) {
      throw new AppError('Order not found', 404);
    }

    if (currentOrder.paymentStatus === 'rejected' && payload.status !== 'cancelled') {
      throw new AppError('Rejected payments can only remain in the cancelled order state', 400);
    }

    if (currentOrder.status === payload.status) {
      throw new AppError('Order already has that status', 400);
    }

    const affectedRows = await updateOrderStatusById(orderId, payload.status, connection);

    if (!affectedRows) {
      throw new AppError('Order status could not be updated', 404);
    }

    await createAuditLogRecord(
      {
        adminUserId: actor.adminUserId,
        action: 'order_status_changed',
        entityType: 'order',
        entityId: currentOrder.id,
        oldValue: {
          status: currentOrder.status,
          paymentStatus: currentOrder.paymentStatus,
        },
        newValue: {
          status: payload.status,
          paymentStatus: currentOrder.paymentStatus,
          note: payload.note || null,
        },
        ipAddress: actor.ipAddress,
        userAgent: actor.userAgent,
      },
      connection,
    );

    await connection.commit();

    const updatedOrder = await findOrderByIdForAdmin(orderId);

    if (!updatedOrder) {
      throw new AppError('Updated order could not be loaded', 500);
    }

    const items = await listOrderItemsByOrderId(orderId);

    return {
      ...updatedOrder,
      items,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

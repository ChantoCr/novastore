import { dbPool } from '../config/db.js';

function parseJsonField(value) {
  if (!value) {
    return null;
  }

  if (typeof value === 'object') {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function mapOrderRow(row) {
  return {
    id: row.id,
    userId: row.user_id,
    couponId: row.coupon_id,
    couponCode: row.coupon_code,
    status: row.status,
    subtotal: Number(row.subtotal),
    discountTotal: Number(row.discount_total),
    taxTotal: Number(row.tax_total),
    total: Number(row.total),
    paymentStatus: row.payment_status,
    shippingAddress: parseJsonField(row.shipping_address),
    billingAddress: parseJsonField(row.billing_address),
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    itemCount: row.item_count === undefined ? undefined : Number(row.item_count),
    totalQuantity: row.total_quantity === undefined ? undefined : Number(row.total_quantity),
    customer:
      row.customer_id || row.customer_name || row.customer_email
        ? {
            id: row.customer_id ? Number(row.customer_id) : Number(row.user_id),
            name: row.customer_name || null,
            email: row.customer_email || null,
          }
        : null,
    payment: row.payment_record_id
      ? {
          id: row.payment_record_id,
          providerReference: row.provider_reference,
          status: row.payment_record_status,
          amount: Number(row.payment_amount),
          currency: row.payment_currency,
          cardLast4: row.simulated_card_last4,
          processedAt: row.payment_processed_at,
        }
      : null,
  };
}

function mapOrderItemRow(row) {
  return {
    id: row.id,
    orderId: row.order_id,
    productId: row.product_id,
    productName: row.product_name_snapshot,
    productSku: row.product_sku_snapshot,
    unitPrice: Number(row.unit_price),
    quantity: row.quantity,
    lineTotal: Number(row.line_total),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function buildUserOrderListQuery({ whereClause }) {
  return `
    SELECT
      o.id,
      o.user_id,
      o.coupon_id,
      c.code AS coupon_code,
      o.status,
      o.subtotal,
      o.discount_total,
      o.tax_total,
      o.total,
      o.payment_status,
      o.shipping_address,
      o.billing_address,
      o.notes,
      o.created_at,
      o.updated_at,
      COUNT(oi.id) AS item_count,
      COALESCE(SUM(oi.quantity), 0) AS total_quantity
    FROM orders o
    LEFT JOIN coupons c ON c.id = o.coupon_id
    LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE ${whereClause}
    GROUP BY
      o.id,
      o.user_id,
      o.coupon_id,
      c.code,
      o.status,
      o.subtotal,
      o.discount_total,
      o.tax_total,
      o.total,
      o.payment_status,
      o.shipping_address,
      o.billing_address,
      o.notes,
      o.created_at,
      o.updated_at
  `;
}

function buildAdminOrderListQuery({ whereClause }) {
  return `
    SELECT
      o.id,
      o.user_id,
      u.id AS customer_id,
      u.name AS customer_name,
      u.email AS customer_email,
      o.coupon_id,
      c.code AS coupon_code,
      o.status,
      o.subtotal,
      o.discount_total,
      o.tax_total,
      o.total,
      o.payment_status,
      o.shipping_address,
      o.billing_address,
      o.notes,
      o.created_at,
      o.updated_at,
      COUNT(oi.id) AS item_count,
      COALESCE(SUM(oi.quantity), 0) AS total_quantity
    FROM orders o
    INNER JOIN users u ON u.id = o.user_id
    LEFT JOIN coupons c ON c.id = o.coupon_id
    LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE ${whereClause}
    GROUP BY
      o.id,
      o.user_id,
      u.id,
      u.name,
      u.email,
      o.coupon_id,
      c.code,
      o.status,
      o.subtotal,
      o.discount_total,
      o.tax_total,
      o.total,
      o.payment_status,
      o.shipping_address,
      o.billing_address,
      o.notes,
      o.created_at,
      o.updated_at
  `;
}

export async function listOrdersByUser({ userId, page, limit, status }) {
  const offset = (page - 1) * limit;
  const whereClauses = ['o.user_id = ?'];
  const params = [userId];

  if (status && status !== 'all') {
    whereClauses.push('o.status = ?');
    params.push(status);
  }

  const [rows] = await dbPool.query(
    `${buildUserOrderListQuery({ whereClause: whereClauses.join(' AND ') })}
     ORDER BY o.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  );

  return rows.map(mapOrderRow);
}

export async function countOrdersByUser({ userId, status }) {
  const whereClauses = ['user_id = ?'];
  const params = [userId];

  if (status && status !== 'all') {
    whereClauses.push('status = ?');
    params.push(status);
  }

  const [rows] = await dbPool.query(
    `
      SELECT COUNT(*) AS total
      FROM orders
      WHERE ${whereClauses.join(' AND ')}
    `,
    params,
  );

  return Number(rows[0]?.total || 0);
}

export async function getOrderMetricsByUser(userId) {
  const [rows] = await dbPool.query(
    `
      SELECT
        COUNT(*) AS total_orders,
        COALESCE(SUM(CASE WHEN payment_status = 'approved' THEN total ELSE 0 END), 0) AS total_spent,
        COALESCE(SUM(CASE WHEN payment_status = 'approved' THEN 1 ELSE 0 END), 0) AS approved_orders,
        COALESCE(SUM(CASE WHEN payment_status = 'pending' THEN 1 ELSE 0 END), 0) AS pending_orders
      FROM orders
      WHERE user_id = ?
    `,
    [userId],
  );

  const row = rows[0] || {};

  return {
    totalOrders: Number(row.total_orders || 0),
    totalSpent: Number(row.total_spent || 0),
    approvedOrders: Number(row.approved_orders || 0),
    pendingOrders: Number(row.pending_orders || 0),
  };
}

export async function findOrderByIdForUser(orderId, userId) {
  const [rows] = await dbPool.query(
    `
      SELECT
        o.id,
        o.user_id,
        o.coupon_id,
        c.code AS coupon_code,
        o.status,
        o.subtotal,
        o.discount_total,
        o.tax_total,
        o.total,
        o.payment_status,
        o.shipping_address,
        o.billing_address,
        o.notes,
        o.created_at,
        o.updated_at,
        COUNT(oi.id) AS item_count,
        COALESCE(SUM(oi.quantity), 0) AS total_quantity,
        ps.id AS payment_record_id,
        ps.provider_reference,
        ps.status AS payment_record_status,
        ps.amount AS payment_amount,
        ps.currency AS payment_currency,
        ps.simulated_card_last4,
        ps.processed_at AS payment_processed_at
      FROM orders o
      LEFT JOIN coupons c ON c.id = o.coupon_id
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN payments_simulated ps ON ps.order_id = o.id
      WHERE o.id = ?
        AND o.user_id = ?
      GROUP BY
        o.id,
        o.user_id,
        o.coupon_id,
        c.code,
        o.status,
        o.subtotal,
        o.discount_total,
        o.tax_total,
        o.total,
        o.payment_status,
        o.shipping_address,
        o.billing_address,
        o.notes,
        o.created_at,
        o.updated_at,
        ps.id,
        ps.provider_reference,
        ps.status,
        ps.amount,
        ps.currency,
        ps.simulated_card_last4,
        ps.processed_at
      LIMIT 1
    `,
    [orderId, userId],
  );

  return rows[0] ? mapOrderRow(rows[0]) : null;
}

export async function listOrdersForAdmin({ page, limit, status, paymentStatus, search }) {
  const offset = (page - 1) * limit;
  const whereClauses = ['1 = 1'];
  const params = [];

  if (status && status !== 'all') {
    whereClauses.push('o.status = ?');
    params.push(status);
  }

  if (paymentStatus && paymentStatus !== 'all') {
    whereClauses.push('o.payment_status = ?');
    params.push(paymentStatus);
  }

  if (search) {
    whereClauses.push('(CAST(o.id AS CHAR) LIKE ? OR u.name LIKE ? OR u.email LIKE ?)');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  const [rows] = await dbPool.query(
    `${buildAdminOrderListQuery({ whereClause: whereClauses.join(' AND ') })}
     ORDER BY o.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  );

  return rows.map(mapOrderRow);
}

export async function countOrdersForAdmin({ status, paymentStatus, search }) {
  const whereClauses = ['1 = 1'];
  const params = [];

  if (status && status !== 'all') {
    whereClauses.push('o.status = ?');
    params.push(status);
  }

  if (paymentStatus && paymentStatus !== 'all') {
    whereClauses.push('o.payment_status = ?');
    params.push(paymentStatus);
  }

  if (search) {
    whereClauses.push('(CAST(o.id AS CHAR) LIKE ? OR u.name LIKE ? OR u.email LIKE ?)');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  const [rows] = await dbPool.query(
    `
      SELECT COUNT(*) AS total
      FROM orders o
      INNER JOIN users u ON u.id = o.user_id
      WHERE ${whereClauses.join(' AND ')}
    `,
    params,
  );

  return Number(rows[0]?.total || 0);
}

export async function getOrderMetricsForAdmin() {
  const [rows] = await dbPool.query(
    `
      SELECT
        COUNT(*) AS total_orders,
        COALESCE(SUM(CASE WHEN payment_status = 'approved' THEN total ELSE 0 END), 0) AS approved_revenue,
        COALESCE(SUM(CASE WHEN payment_status = 'pending' THEN 1 ELSE 0 END), 0) AS pending_orders,
        COALESCE(SUM(CASE WHEN payment_status = 'rejected' THEN 1 ELSE 0 END), 0) AS rejected_orders
      FROM orders
    `,
  );

  const row = rows[0] || {};

  return {
    totalOrders: Number(row.total_orders || 0),
    approvedRevenue: Number(row.approved_revenue || 0),
    pendingOrders: Number(row.pending_orders || 0),
    rejectedOrders: Number(row.rejected_orders || 0),
  };
}

export async function findOrderByIdForAdmin(orderId) {
  const [rows] = await dbPool.query(
    `
      SELECT
        o.id,
        o.user_id,
        u.id AS customer_id,
        u.name AS customer_name,
        u.email AS customer_email,
        o.coupon_id,
        c.code AS coupon_code,
        o.status,
        o.subtotal,
        o.discount_total,
        o.tax_total,
        o.total,
        o.payment_status,
        o.shipping_address,
        o.billing_address,
        o.notes,
        o.created_at,
        o.updated_at,
        COUNT(oi.id) AS item_count,
        COALESCE(SUM(oi.quantity), 0) AS total_quantity,
        ps.id AS payment_record_id,
        ps.provider_reference,
        ps.status AS payment_record_status,
        ps.amount AS payment_amount,
        ps.currency AS payment_currency,
        ps.simulated_card_last4,
        ps.processed_at AS payment_processed_at
      FROM orders o
      INNER JOIN users u ON u.id = o.user_id
      LEFT JOIN coupons c ON c.id = o.coupon_id
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN payments_simulated ps ON ps.order_id = o.id
      WHERE o.id = ?
      GROUP BY
        o.id,
        o.user_id,
        u.id,
        u.name,
        u.email,
        o.coupon_id,
        c.code,
        o.status,
        o.subtotal,
        o.discount_total,
        o.tax_total,
        o.total,
        o.payment_status,
        o.shipping_address,
        o.billing_address,
        o.notes,
        o.created_at,
        o.updated_at,
        ps.id,
        ps.provider_reference,
        ps.status,
        ps.amount,
        ps.currency,
        ps.simulated_card_last4,
        ps.processed_at
      LIMIT 1
    `,
    [orderId],
  );

  return rows[0] ? mapOrderRow(rows[0]) : null;
}

export async function updateOrderStatusById(orderId, status, executor = dbPool) {
  const [result] = await executor.query(
    `
      UPDATE orders
      SET status = ?
      WHERE id = ?
    `,
    [status, orderId],
  );

  return result.affectedRows;
}

export async function listOrderItemsByOrderId(orderId) {
  const [rows] = await dbPool.query(
    `
      SELECT
        id,
        order_id,
        product_id,
        product_name_snapshot,
        product_sku_snapshot,
        unit_price,
        quantity,
        line_total,
        created_at,
        updated_at
      FROM order_items
      WHERE order_id = ?
      ORDER BY id ASC
    `,
    [orderId],
  );

  return rows.map(mapOrderItemRow);
}

import crypto from 'node:crypto';

import { dbPool } from '../../src/config/db.js';

function randomSuffix() {
  return crypto.randomBytes(4).toString('hex');
}

export function createUniqueTestKey(prefix = 'checkout-test') {
  return `${prefix}-${Date.now()}-${randomSuffix()}`;
}

export function buildCheckoutPayload({
  productId,
  quantity = 1,
  couponCode = '',
  cardNumber = '4242424242424242',
  notes,
}) {
  return {
    items: [
      {
        productId,
        quantity,
      },
    ],
    couponCode,
    shippingAddress: {
      fullName: 'NOVA Test User',
      country: 'Demo Country',
      city: 'Demo City',
      line1: '123 Integration Street',
      line2: '',
      state: 'Test State',
      postalCode: '10001',
      phone: '+1-555-0101',
    },
    billingAddress: {
      fullName: 'NOVA Test User',
      country: 'Demo Country',
      city: 'Demo City',
      line1: '123 Integration Street',
      line2: '',
      state: 'Test State',
      postalCode: '10001',
      phone: '+1-555-0101',
    },
    paymentMethod: {
      cardholderName: 'NOVA Test User',
      cardNumber,
      expiryMonth: 12,
      expiryYear: new Date().getFullYear() + 2,
      cvv: '123',
    },
    notes,
  };
}

export async function createTestProduct({
  categoryId = 1,
  price = 100,
  stock = 10,
  isActive = true,
  name,
  slug,
  sku,
} = {}) {
  const testKey = createUniqueTestKey('product');
  const productName = name || `Integration Product ${testKey}`;
  const productSlug = slug || `integration-product-${testKey}`;
  const productSku = sku || `IT-${testKey}`.toUpperCase();

  const [result] = await dbPool.query(
    `
      INSERT INTO products (
        category_id,
        name,
        slug,
        sku,
        description,
        price,
        compare_at_price,
        stock,
        low_stock_threshold,
        is_active
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      categoryId,
      productName,
      productSlug,
      productSku,
      'Temporary checkout integration test product.',
      price,
      null,
      stock,
      2,
      isActive ? 1 : 0,
    ],
  );

  return {
    id: result.insertId,
    name: productName,
    slug: productSlug,
    sku: productSku,
    price,
    stock,
  };
}

export async function createTestCoupon({
  code,
  discountType = 'fixed',
  discountValue = 25,
  minPurchaseAmount = 0,
  usageLimit = 10,
  usedCount = 0,
  isActive = true,
} = {}) {
  const couponCode = code || `TEST${randomSuffix().toUpperCase()}`;

  const [result] = await dbPool.query(
    `
      INSERT INTO coupons (
        code,
        discount_type,
        discount_value,
        min_purchase_amount,
        usage_limit,
        used_count,
        starts_at,
        expires_at,
        is_active
      )
      VALUES (?, ?, ?, ?, ?, ?, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), ?)
    `,
    [
      couponCode,
      discountType,
      discountValue,
      minPurchaseAmount,
      usageLimit,
      usedCount,
      isActive ? 1 : 0,
    ],
  );

  return {
    id: result.insertId,
    code: couponCode,
    discountType,
    discountValue,
    minPurchaseAmount,
    usageLimit,
    usedCount,
  };
}

export async function getProductSnapshot(productId) {
  const [rows] = await dbPool.query(
    `
      SELECT id, name, stock, price, is_active, deleted_at
      FROM products
      WHERE id = ?
      LIMIT 1
    `,
    [productId],
  );

  const row = rows[0];

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    stock: row.stock,
    price: Number(row.price),
    isActive: Boolean(row.is_active),
    deletedAt: row.deleted_at,
  };
}

export async function getCouponSnapshot(couponId) {
  const [rows] = await dbPool.query(
    `
      SELECT id, code, used_count, usage_limit, is_active
      FROM coupons
      WHERE id = ?
      LIMIT 1
    `,
    [couponId],
  );

  const row = rows[0];

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    code: row.code,
    usedCount: row.used_count,
    usageLimit: row.usage_limit,
    isActive: Boolean(row.is_active),
  };
}

export async function getOrderSnapshot(orderId) {
  const [rows] = await dbPool.query(
    `
      SELECT id, user_id, coupon_id, status, subtotal, discount_total, tax_total, total, payment_status, notes
      FROM orders
      WHERE id = ?
      LIMIT 1
    `,
    [orderId],
  );

  const row = rows[0];

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    userId: row.user_id,
    couponId: row.coupon_id,
    status: row.status,
    subtotal: Number(row.subtotal),
    discountTotal: Number(row.discount_total),
    taxTotal: Number(row.tax_total),
    total: Number(row.total),
    paymentStatus: row.payment_status,
    notes: row.notes,
  };
}

export async function getPaymentSnapshotByOrderId(orderId) {
  const [rows] = await dbPool.query(
    `
      SELECT order_id, status, amount, currency, simulated_card_last4
      FROM payments_simulated
      WHERE order_id = ?
      LIMIT 1
    `,
    [orderId],
  );

  const row = rows[0];

  if (!row) {
    return null;
  }

  return {
    orderId: row.order_id,
    status: row.status,
    amount: Number(row.amount),
    currency: row.currency,
    cardLast4: row.simulated_card_last4,
  };
}

export async function getCouponUsageByOrderId(orderId) {
  const [rows] = await dbPool.query(
    `
      SELECT coupon_id, user_id, order_id, discount_amount
      FROM coupon_usages
      WHERE order_id = ?
      LIMIT 1
    `,
    [orderId],
  );

  const row = rows[0];

  if (!row) {
    return null;
  }

  return {
    couponId: row.coupon_id,
    userId: row.user_id,
    orderId: row.order_id,
    discountAmount: Number(row.discount_amount),
  };
}

export async function getNotificationByOrderId(orderId) {
  const [rows] = await dbPool.query(
    `
      SELECT id, user_id, type, title, message
      FROM notifications
      WHERE JSON_UNQUOTE(JSON_EXTRACT(metadata, '$.orderId')) = ?
      ORDER BY id DESC
      LIMIT 1
    `,
    [String(orderId)],
  );

  const row = rows[0];

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    title: row.title,
    message: row.message,
  };
}

export async function countOrdersByNotes(notes) {
  const [rows] = await dbPool.query(
    `
      SELECT COUNT(*) AS total
      FROM orders
      WHERE notes = ?
    `,
    [notes],
  );

  return rows[0]?.total || 0;
}

export async function cleanupCheckoutArtifacts({ orderId = null, couponId = null, productId = null } = {}) {
  if (orderId) {
    await dbPool.query(
      `
        DELETE FROM notifications
        WHERE JSON_UNQUOTE(JSON_EXTRACT(metadata, '$.orderId')) = ?
      `,
      [String(orderId)],
    );

    await dbPool.query(
      `
        DELETE FROM orders
        WHERE id = ?
      `,
      [orderId],
    );
  }

  if (couponId) {
    await dbPool.query(
      `
        DELETE FROM coupons
        WHERE id = ?
      `,
      [couponId],
    );
  }

  if (productId) {
    await dbPool.query(
      `
        DELETE FROM products
        WHERE id = ?
      `,
      [productId],
    );
  }
}

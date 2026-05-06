import { dbPool } from '../config/db.js';

function mapCouponRow(row) {
  return {
    id: row.id,
    code: row.code,
    discountType: row.discount_type,
    discountValue: Number(row.discount_value),
    minPurchaseAmount: Number(row.min_purchase_amount),
    usageLimit: row.usage_limit === null ? null : Number(row.usage_limit),
    usedCount: Number(row.used_count),
    startsAt: row.starts_at,
    expiresAt: row.expires_at,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function buildCouponFilters({ search, status = 'all', discountType = 'all' }) {
  const whereClauses = ['1 = 1'];
  const params = [];

  if (status === 'active') {
    whereClauses.push('c.is_active = 1');
  } else if (status === 'inactive') {
    whereClauses.push('c.is_active = 0');
  }

  if (discountType !== 'all') {
    whereClauses.push('c.discount_type = ?');
    params.push(discountType);
  }

  if (search) {
    whereClauses.push('c.code LIKE ?');
    params.push(`%${search}%`);
  }

  return {
    whereSql: `WHERE ${whereClauses.join(' AND ')}`,
    params,
  };
}

export async function listCoupons({ page, limit, search, status, discountType }, executor = dbPool) {
  const offset = (page - 1) * limit;
  const { whereSql, params } = buildCouponFilters({ search, status, discountType });

  const [rows] = await executor.query(
    `
      SELECT
        c.id,
        c.code,
        c.discount_type,
        c.discount_value,
        c.min_purchase_amount,
        c.usage_limit,
        c.used_count,
        c.starts_at,
        c.expires_at,
        c.is_active,
        c.created_at,
        c.updated_at
      FROM coupons c
      ${whereSql}
      ORDER BY c.created_at DESC, c.id DESC
      LIMIT ? OFFSET ?
    `,
    [...params, limit, offset],
  );

  return rows.map(mapCouponRow);
}

export async function countCoupons({ search, status, discountType }, executor = dbPool) {
  const { whereSql, params } = buildCouponFilters({ search, status, discountType });

  const [rows] = await executor.query(
    `
      SELECT COUNT(*) AS total
      FROM coupons c
      ${whereSql}
    `,
    params,
  );

  return Number(rows[0]?.total || 0);
}

export async function findCouponById(couponId, executor = dbPool) {
  const [rows] = await executor.query(
    `
      SELECT
        c.id,
        c.code,
        c.discount_type,
        c.discount_value,
        c.min_purchase_amount,
        c.usage_limit,
        c.used_count,
        c.starts_at,
        c.expires_at,
        c.is_active,
        c.created_at,
        c.updated_at
      FROM coupons c
      WHERE c.id = ?
      LIMIT 1
    `,
    [couponId],
  );

  return rows[0] ? mapCouponRow(rows[0]) : null;
}

export async function findCouponByCode(code, executor = dbPool) {
  const [rows] = await executor.query(
    `
      SELECT
        c.id,
        c.code,
        c.discount_type,
        c.discount_value,
        c.min_purchase_amount,
        c.usage_limit,
        c.used_count,
        c.starts_at,
        c.expires_at,
        c.is_active,
        c.created_at,
        c.updated_at
      FROM coupons c
      WHERE c.code = ?
      LIMIT 1
    `,
    [code],
  );

  return rows[0] ? mapCouponRow(rows[0]) : null;
}

export async function createCoupon(coupon, executor = dbPool) {
  const [result] = await executor.query(
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
      VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?)
    `,
    [
      coupon.code,
      coupon.discountType,
      coupon.discountValue,
      coupon.minPurchaseAmount,
      coupon.usageLimit,
      coupon.startsAt,
      coupon.expiresAt,
      coupon.isActive,
    ],
  );

  return result.insertId;
}

export async function updateCouponById(couponId, data, executor = dbPool) {
  const updates = [];
  const params = [];

  const fieldMap = {
    code: 'code',
    discountType: 'discount_type',
    discountValue: 'discount_value',
    minPurchaseAmount: 'min_purchase_amount',
    usageLimit: 'usage_limit',
    startsAt: 'starts_at',
    expiresAt: 'expires_at',
    isActive: 'is_active',
  };

  for (const [key, column] of Object.entries(fieldMap)) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      updates.push(`${column} = ?`);
      params.push(data[key]);
    }
  }

  if (!updates.length) {
    return 0;
  }

  params.push(couponId);

  const [result] = await executor.query(
    `
      UPDATE coupons
      SET ${updates.join(', ')}
      WHERE id = ?
    `,
    params,
  );

  return result.affectedRows;
}

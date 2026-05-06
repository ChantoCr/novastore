import { dbPool } from '../config/db.js';
import { createAuditLogRecord } from '../repositories/audit.repository.js';
import {
  countCoupons,
  createCoupon,
  findCouponByCode,
  findCouponById,
  listCoupons,
  updateCouponById,
} from '../repositories/coupon.repository.js';
import { AppError } from '../utils/appError.js';

function normalizeCouponPayload(payload) {
  return {
    ...payload,
    code: payload.code ? payload.code.trim().toUpperCase() : payload.code,
  };
}

function buildAuditContext(actor) {
  return {
    adminUserId: actor.adminUserId,
    ipAddress: actor.ipAddress,
    userAgent: actor.userAgent,
  };
}

async function ensureCouponCodeIsUnique(code, { excludeId = null, executor } = {}) {
  if (!code) {
    return;
  }

  const existingCoupon = await findCouponByCode(code, executor);

  if (existingCoupon && existingCoupon.id !== excludeId) {
    throw new AppError('A coupon with this code already exists', 409);
  }
}

export async function getCoupons(query) {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const search = query.search?.trim() || '';
  const status = query.status || 'all';
  const discountType = query.discountType || 'all';

  const [items, totalItems] = await Promise.all([
    listCoupons({ page, limit, search, status, discountType }),
    countCoupons({ search, status, discountType }),
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
      search,
      status,
      discountType,
    },
  };
}

export async function createCouponRecord(payload, actor) {
  const normalizedPayload = normalizeCouponPayload(payload);
  const connection = await dbPool.getConnection();

  try {
    await connection.beginTransaction();

    await ensureCouponCodeIsUnique(normalizedPayload.code, { executor: connection });

    const couponId = await createCoupon(normalizedPayload, connection);
    const coupon = await findCouponById(couponId, connection);

    if (!coupon) {
      throw new AppError('Coupon created but could not be loaded', 500);
    }

    await createAuditLogRecord(
      {
        ...buildAuditContext(actor),
        action: 'coupon_created',
        entityType: 'coupon',
        entityId: coupon.id,
        oldValue: null,
        newValue: coupon,
      },
      connection,
    );

    await connection.commit();

    return coupon;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function updateCouponRecord(couponId, payload, actor) {
  const normalizedPayload = normalizeCouponPayload(payload);
  const connection = await dbPool.getConnection();

  try {
    await connection.beginTransaction();

    const currentCoupon = await findCouponById(couponId, connection);

    if (!currentCoupon) {
      throw new AppError('Coupon not found', 404);
    }

    await ensureCouponCodeIsUnique(normalizedPayload.code, {
      excludeId: currentCoupon.id,
      executor: connection,
    });

    const affectedRows = await updateCouponById(couponId, normalizedPayload, connection);

    if (!affectedRows) {
      throw new AppError('Coupon not found or no changes were applied', 404);
    }

    const coupon = await findCouponById(couponId, connection);

    if (!coupon) {
      throw new AppError('Coupon updated but could not be loaded', 500);
    }

    const action =
      Object.keys(normalizedPayload).length === 1 && Object.prototype.hasOwnProperty.call(normalizedPayload, 'isActive')
        ? 'coupon_status_changed'
        : 'coupon_updated';

    await createAuditLogRecord(
      {
        ...buildAuditContext(actor),
        action,
        entityType: 'coupon',
        entityId: coupon.id,
        oldValue: currentCoupon,
        newValue: coupon,
      },
      connection,
    );

    await connection.commit();

    return coupon;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

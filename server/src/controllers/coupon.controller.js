import { successResponse } from '../utils/apiResponse.js';
import {
  createCouponRecord,
  getCoupons,
  updateCouponRecord,
} from '../services/coupon.service.js';

function buildActorContext(req) {
  return {
    adminUserId: req.user.id,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
  };
}

export async function listCoupons(req, res) {
  const data = await getCoupons(req.query);

  res.status(200).json(
    successResponse({
      message: 'Coupons loaded successfully',
      data,
    }),
  );
}

export async function createCoupon(req, res) {
  const data = await createCouponRecord(req.body, buildActorContext(req));

  res.status(201).json(
    successResponse({
      message: 'Coupon created successfully',
      data,
    }),
  );
}

export async function updateCoupon(req, res) {
  const data = await updateCouponRecord(req.params.couponId, req.body, buildActorContext(req));

  res.status(200).json(
    successResponse({
      message: 'Coupon updated successfully',
      data,
    }),
  );
}

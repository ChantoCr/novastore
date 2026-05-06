import { Router } from 'express';

import { createCoupon, listCoupons, updateCoupon } from '../controllers/coupon.controller.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  couponIdentifierSchema,
  createCouponSchema,
  listCouponsQuerySchema,
  updateCouponSchema,
} from '../validators/coupon.validators.js';

const couponRouter = Router();

couponRouter.use(authenticateToken, authorizeRoles('admin'));

couponRouter.get('/', validateRequest({ query: listCouponsQuerySchema }), asyncHandler(listCoupons));
couponRouter.post('/', validateRequest({ body: createCouponSchema }), asyncHandler(createCoupon));
couponRouter.patch(
  '/:couponId',
  validateRequest({ params: couponIdentifierSchema, body: updateCouponSchema }),
  asyncHandler(updateCoupon),
);

export default couponRouter;

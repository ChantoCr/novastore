import crypto from 'node:crypto';

import { dbPool } from '../config/db.js';
import {
  createCouponUsageRecord,
  createNotificationRecord,
  createOrderItemsRecords,
  createOrderRecord,
  createPaymentSimulationRecord,
  createStockMovementRecords,
  findCouponByCode,
  findProductsForCheckoutByIds,
  incrementCouponUsedCount,
  updateProductStockById,
} from '../repositories/checkout.repository.js';
import { AppError } from '../utils/appError.js';

const SIMULATED_TAX_RATE = 0.08;

function roundMoney(value) {
  return Number((Math.round((value + Number.EPSILON) * 100) / 100).toFixed(2));
}

function normalizeCheckoutItems(items) {
  const consolidatedItems = new Map();

  for (const item of items) {
    const currentQuantity = consolidatedItems.get(item.productId) || 0;
    consolidatedItems.set(item.productId, currentQuantity + item.quantity);
  }

  return Array.from(consolidatedItems.entries()).map(([productId, quantity]) => ({
    productId,
    quantity,
  }));
}

function validateCoupon(coupon, subtotal) {
  const now = new Date();

  if (!coupon) {
    throw new AppError('Coupon not found', 404);
  }

  if (!coupon.isActive) {
    throw new AppError('Coupon is inactive', 400);
  }

  if (coupon.startsAt && new Date(coupon.startsAt) > now) {
    throw new AppError('Coupon is not active yet', 400);
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < now) {
    throw new AppError('Coupon has expired', 400);
  }

  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    throw new AppError('Coupon usage limit has been reached', 400);
  }

  if (subtotal < coupon.minPurchaseAmount) {
    throw new AppError(
      `Coupon requires a minimum purchase of ${coupon.minPurchaseAmount.toFixed(2)}`,
      400,
    );
  }
}

function calculateDiscountTotal(coupon, subtotal) {
  if (!coupon) {
    return 0;
  }

  if (coupon.discountType === 'percentage') {
    return roundMoney(Math.min(subtotal, subtotal * (coupon.discountValue / 100)));
  }

  return roundMoney(Math.min(subtotal, coupon.discountValue));
}

function simulatePayment(paymentMethod, total) {
  const sanitizedCardNumber = paymentMethod.cardNumber.replace(/\D/g, '');
  const last4 = sanitizedCardNumber.slice(-4);

  let status = 'approved';
  let message = 'Simulated payment approved successfully.';

  if (last4 === '0002') {
    status = 'rejected';
    message = 'Simulated payment was rejected by the demo gateway.';
  } else if (last4 === '9995') {
    status = 'pending';
    message = 'Simulated payment is pending manual confirmation.';
  }

  return {
    status,
    message,
    amount: total,
    currency: 'USD',
    providerReference: `SIM-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
    simulatedCardLast4: last4,
    responsePayload: {
      gateway: 'simulated',
      result: status,
      message,
    },
  };
}

function getOrderStateFromPaymentStatus(paymentStatus) {
  if (paymentStatus === 'approved') {
    return {
      orderStatus: 'paid',
      paymentStatus: 'approved',
    };
  }

  if (paymentStatus === 'rejected') {
    return {
      orderStatus: 'cancelled',
      paymentStatus: 'rejected',
    };
  }

  return {
    orderStatus: 'pending',
    paymentStatus: 'pending',
  };
}

function buildNotification(orderId, paymentResult) {
  if (paymentResult.status === 'approved') {
    return {
      type: 'order',
      title: 'Order approved',
      message: `Your order #${orderId} was approved successfully.`,
      metadata: {
        orderId,
        paymentStatus: paymentResult.status,
      },
    };
  }

  if (paymentResult.status === 'rejected') {
    return {
      type: 'order',
      title: 'Order payment rejected',
      message: `Your order #${orderId} could not be approved. You can review your cart and try again.`,
      metadata: {
        orderId,
        paymentStatus: paymentResult.status,
      },
    };
  }

  return {
    type: 'order',
    title: 'Order pending confirmation',
    message: `Your order #${orderId} is pending payment confirmation.`,
    metadata: {
      orderId,
      paymentStatus: paymentResult.status,
    },
  };
}

export async function createCheckoutOrder(userId, payload) {
  const normalizedItems = normalizeCheckoutItems(payload.items);

  if (!normalizedItems.length) {
    throw new AppError('Checkout requires at least one cart item', 400);
  }

  const connection = await dbPool.getConnection();

  try {
    await connection.beginTransaction();

    const products = await findProductsForCheckoutByIds(
      normalizedItems.map((item) => item.productId),
      connection,
    );
    const productsById = new Map(products.map((product) => [product.id, product]));

    const orderItems = normalizedItems.map((item) => {
      const product = productsById.get(item.productId);

      if (!product || product.deletedAt || !product.isActive) {
        throw new AppError(`Product ${item.productId} is not available for checkout`, 400);
      }

      if (product.stock < item.quantity) {
        throw new AppError(`Insufficient stock for ${product.name}`, 409);
      }

      const unitPrice = roundMoney(product.price);
      const lineTotal = roundMoney(unitPrice * item.quantity);

      return {
        productId: product.id,
        productNameSnapshot: product.name,
        productSkuSnapshot: product.sku,
        unitPrice,
        quantity: item.quantity,
        lineTotal,
        previousStock: product.stock,
        newStock: product.stock - item.quantity,
      };
    });

    const subtotal = roundMoney(
      orderItems.reduce((sum, item) => sum + item.lineTotal, 0),
    );

    const normalizedCouponCode = payload.couponCode?.trim() || null;
    let coupon = null;

    if (normalizedCouponCode) {
      coupon = await findCouponByCode(normalizedCouponCode, connection);
      validateCoupon(coupon, subtotal);
    }

    const discountTotal = calculateDiscountTotal(coupon, subtotal);
    const taxableBase = Math.max(0, subtotal - discountTotal);
    const taxTotal = roundMoney(taxableBase * SIMULATED_TAX_RATE);
    const total = roundMoney(taxableBase + taxTotal);
    const paymentResult = simulatePayment(payload.paymentMethod, total);
    const { orderStatus, paymentStatus } = getOrderStateFromPaymentStatus(paymentResult.status);

    const shippingAddress = payload.shippingAddress;
    const billingAddress = payload.billingAddress || payload.shippingAddress;

    const orderId = await createOrderRecord(
      {
        userId,
        couponId: coupon?.id || null,
        status: orderStatus,
        subtotal,
        discountTotal,
        taxTotal,
        total,
        paymentStatus,
        shippingAddress,
        billingAddress,
        notes: payload.notes?.trim() || null,
      },
      connection,
    );

    await createOrderItemsRecords(orderId, orderItems, connection);
    await createPaymentSimulationRecord(
      {
        orderId,
        ...paymentResult,
      },
      connection,
    );

    if (paymentResult.status === 'approved') {
      for (const item of orderItems) {
        await updateProductStockById(item.productId, item.newStock, connection);
      }

      await createStockMovementRecords(
        orderItems.map((item) => ({
          productId: item.productId,
          adminUserId: null,
          movementType: 'sale',
          quantityChange: -item.quantity,
          previousStock: item.previousStock,
          newStock: item.newStock,
          reason: `Checkout order #${orderId}`,
        })),
        connection,
      );

      if (coupon) {
        await incrementCouponUsedCount(coupon.id, connection);
        await createCouponUsageRecord(
          {
            couponId: coupon.id,
            userId,
            orderId,
            discountAmount: discountTotal,
          },
          connection,
        );
      }
    }

    const notification = buildNotification(orderId, paymentResult);
    await createNotificationRecord(
      {
        userId,
        ...notification,
      },
      connection,
    );

    await connection.commit();

    return {
      order: {
        id: orderId,
        status: orderStatus,
        paymentStatus,
        subtotal,
        discountTotal,
        taxTotal,
        total,
        couponCode: coupon?.code || null,
        items: orderItems.map((item) => ({
          productId: item.productId,
          productName: item.productNameSnapshot,
          productSku: item.productSkuSnapshot,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          lineTotal: item.lineTotal,
        })),
        shippingAddress,
        billingAddress,
        notes: payload.notes?.trim() || null,
      },
      payment: {
        status: paymentResult.status,
        message: paymentResult.message,
        providerReference: paymentResult.providerReference,
        cardLast4: paymentResult.simulatedCardLast4,
      },
      simulation: {
        taxRate: SIMULATED_TAX_RATE,
        stockReduced: paymentResult.status === 'approved',
      },
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

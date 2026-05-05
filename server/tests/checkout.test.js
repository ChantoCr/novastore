import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';

import request from 'supertest';

import app from '../src/app.js';
import { createAuthenticatedSession, userCredentials } from './helpers/auth.js';
import {
  buildCheckoutPayload,
  cleanupCheckoutArtifacts,
  countOrdersByNotes,
  createTestCoupon,
  createTestProduct,
  createUniqueTestKey,
  getCouponSnapshot,
  getCouponUsageByOrderId,
  getNotificationByOrderId,
  getOrderSnapshot,
  getPaymentSnapshotByOrderId,
  getProductSnapshot,
} from './helpers/checkout.js';
import { registerDatabaseLifecycle } from './helpers/db.js';

registerDatabaseLifecycle();

describe('Checkout API integration', () => {
  let userSession;

  before(async () => {
    userSession = await createAuthenticatedSession(userCredentials);
  });

  after(async () => {
    await userSession?.logout();
  });

  it('creates an approved checkout with backend-calculated totals, stock reduction, and coupon usage', async () => {
    const product = await createTestProduct({ price: 100, stock: 10 });
    const coupon = await createTestCoupon({
      discountType: 'fixed',
      discountValue: 25,
      minPurchaseAmount: 150,
      usedCount: 0,
    });
    const notes = createUniqueTestKey('approved-checkout');
    let orderId = null;

    try {
      const response = await request(app)
        .post('/api/checkout')
        .set('Authorization', userSession.authHeader)
        .send(
          buildCheckoutPayload({
            productId: product.id,
            quantity: 2,
            couponCode: coupon.code,
            cardNumber: '4242424242424242',
            notes,
          }),
        );

      assert.equal(response.status, 201);
      assert.equal(response.body.success, true);
      assert.equal(response.body.message, 'Checkout processed successfully');
      assert.equal(response.body.data.order.status, 'paid');
      assert.equal(response.body.data.order.paymentStatus, 'approved');
      assert.equal(response.body.data.order.subtotal, 200);
      assert.equal(response.body.data.order.discountTotal, 25);
      assert.equal(response.body.data.order.taxTotal, 14);
      assert.equal(response.body.data.order.total, 189);
      assert.equal(response.body.data.order.couponCode, coupon.code);
      assert.equal(response.body.data.order.notes, notes);
      assert.equal(response.body.data.order.items.length, 1);
      assert.deepEqual(response.body.data.order.items[0], {
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        unitPrice: 100,
        quantity: 2,
        lineTotal: 200,
      });
      assert.equal(response.body.data.payment.status, 'approved');
      assert.equal(response.body.data.payment.cardLast4, '4242');
      assert.equal(response.body.data.simulation.taxRate, 0.08);
      assert.equal(response.body.data.simulation.stockReduced, true);

      orderId = response.body.data.order.id;

      const [updatedProduct, updatedCoupon, order, payment, couponUsage, notification] = await Promise.all([
        getProductSnapshot(product.id),
        getCouponSnapshot(coupon.id),
        getOrderSnapshot(orderId),
        getPaymentSnapshotByOrderId(orderId),
        getCouponUsageByOrderId(orderId),
        getNotificationByOrderId(orderId),
      ]);

      assert.equal(updatedProduct.stock, 8);
      assert.equal(updatedCoupon.usedCount, 1);

      assert.equal(order.userId, userSession.user.id);
      assert.equal(order.couponId, coupon.id);
      assert.equal(order.status, 'paid');
      assert.equal(order.subtotal, 200);
      assert.equal(order.discountTotal, 25);
      assert.equal(order.taxTotal, 14);
      assert.equal(order.total, 189);
      assert.equal(order.paymentStatus, 'approved');
      assert.equal(order.notes, notes);

      assert.equal(payment.orderId, orderId);
      assert.equal(payment.status, 'approved');
      assert.equal(payment.amount, 189);
      assert.equal(payment.currency, 'USD');
      assert.equal(payment.cardLast4, '4242');

      assert.equal(couponUsage.couponId, coupon.id);
      assert.equal(couponUsage.userId, userSession.user.id);
      assert.equal(couponUsage.orderId, orderId);
      assert.equal(couponUsage.discountAmount, 25);

      assert.equal(notification.userId, userSession.user.id);
      assert.equal(notification.type, 'order');
      assert.equal(notification.title, 'Order approved');
    } finally {
      await cleanupCheckoutArtifacts({
        orderId,
        couponId: coupon.id,
        productId: product.id,
      });
    }
  });

  it('creates a rejected checkout without reducing stock', async () => {
    const product = await createTestProduct({ price: 80, stock: 7 });
    const notes = createUniqueTestKey('rejected-checkout');
    let orderId = null;

    try {
      const response = await request(app)
        .post('/api/checkout')
        .set('Authorization', userSession.authHeader)
        .send(
          buildCheckoutPayload({
            productId: product.id,
            quantity: 1,
            cardNumber: '4000000000000002',
            notes,
          }),
        );

      assert.equal(response.status, 201);
      assert.equal(response.body.success, true);
      assert.equal(response.body.data.order.status, 'cancelled');
      assert.equal(response.body.data.order.paymentStatus, 'rejected');
      assert.equal(response.body.data.order.subtotal, 80);
      assert.equal(response.body.data.order.discountTotal, 0);
      assert.equal(response.body.data.order.taxTotal, 6.4);
      assert.equal(response.body.data.order.total, 86.4);
      assert.equal(response.body.data.payment.status, 'rejected');
      assert.equal(response.body.data.payment.cardLast4, '0002');
      assert.equal(response.body.data.simulation.stockReduced, false);

      orderId = response.body.data.order.id;

      const [updatedProduct, order, payment, notification] = await Promise.all([
        getProductSnapshot(product.id),
        getOrderSnapshot(orderId),
        getPaymentSnapshotByOrderId(orderId),
        getNotificationByOrderId(orderId),
      ]);

      assert.equal(updatedProduct.stock, 7);
      assert.equal(order.status, 'cancelled');
      assert.equal(order.paymentStatus, 'rejected');
      assert.equal(order.total, 86.4);
      assert.equal(payment.status, 'rejected');
      assert.equal(payment.cardLast4, '0002');
      assert.equal(notification.title, 'Order payment rejected');
    } finally {
      await cleanupCheckoutArtifacts({
        orderId,
        productId: product.id,
      });
    }
  });

  it('creates a pending checkout without reducing stock', async () => {
    const product = await createTestProduct({ price: 50, stock: 5 });
    const notes = createUniqueTestKey('pending-checkout');
    let orderId = null;

    try {
      const response = await request(app)
        .post('/api/checkout')
        .set('Authorization', userSession.authHeader)
        .send(
          buildCheckoutPayload({
            productId: product.id,
            quantity: 3,
            cardNumber: '4000000000009995',
            notes,
          }),
        );

      assert.equal(response.status, 201);
      assert.equal(response.body.success, true);
      assert.equal(response.body.data.order.status, 'pending');
      assert.equal(response.body.data.order.paymentStatus, 'pending');
      assert.equal(response.body.data.order.subtotal, 150);
      assert.equal(response.body.data.order.discountTotal, 0);
      assert.equal(response.body.data.order.taxTotal, 12);
      assert.equal(response.body.data.order.total, 162);
      assert.equal(response.body.data.payment.status, 'pending');
      assert.equal(response.body.data.payment.cardLast4, '9995');
      assert.equal(response.body.data.simulation.stockReduced, false);

      orderId = response.body.data.order.id;

      const [updatedProduct, order, payment, notification] = await Promise.all([
        getProductSnapshot(product.id),
        getOrderSnapshot(orderId),
        getPaymentSnapshotByOrderId(orderId),
        getNotificationByOrderId(orderId),
      ]);

      assert.equal(updatedProduct.stock, 5);
      assert.equal(order.status, 'pending');
      assert.equal(order.paymentStatus, 'pending');
      assert.equal(order.total, 162);
      assert.equal(payment.status, 'pending');
      assert.equal(payment.cardLast4, '9995');
      assert.equal(notification.title, 'Order pending confirmation');
    } finally {
      await cleanupCheckoutArtifacts({
        orderId,
        productId: product.id,
      });
    }
  });

  it('rejects checkout when stock is insufficient and does not create an order', async () => {
    const product = await createTestProduct({ price: 40, stock: 1 });
    const notes = createUniqueTestKey('insufficient-stock');

    try {
      const response = await request(app)
        .post('/api/checkout')
        .set('Authorization', userSession.authHeader)
        .send(
          buildCheckoutPayload({
            productId: product.id,
            quantity: 2,
            cardNumber: '4242424242424242',
            notes,
          }),
        );

      assert.equal(response.status, 409);
      assert.equal(response.body.success, false);
      assert.equal(response.body.message, `Insufficient stock for ${product.name}`);
      assert.deepEqual(response.body.errors, []);

      const [updatedProduct, orderCount] = await Promise.all([
        getProductSnapshot(product.id),
        countOrdersByNotes(notes),
      ]);

      assert.equal(updatedProduct.stock, 1);
      assert.equal(orderCount, 0);
    } finally {
      await cleanupCheckoutArtifacts({
        productId: product.id,
      });
    }
  });
});

import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';

import request from 'supertest';

import app from '../src/app.js';
import {
  adminCredentials,
  createAuthenticatedSession,
  userCredentials,
} from './helpers/auth.js';
import { createTestProduct } from './helpers/checkout.js';
import { dbPool } from '../src/config/db.js';
import { registerDatabaseLifecycle } from './helpers/db.js';

registerDatabaseLifecycle();

async function cleanupProduct(productId) {
  await dbPool.query(
    `
      DELETE FROM product_images
      WHERE product_id = ?
    `,
    [productId],
  );

  await dbPool.query(
    `
      DELETE FROM products
      WHERE id = ?
    `,
    [productId],
  );
}

describe('Product image upload API integration', () => {
  let adminSession;
  let userSession;

  before(async () => {
    adminSession = await createAuthenticatedSession(adminCredentials);
    userSession = await createAuthenticatedSession(userCredentials);
  });

  after(async () => {
    await userSession?.logout();
    await adminSession?.logout();
  });

  it('blocks unauthenticated upload attempts', async () => {
    const response = await request(app).post('/api/products/1/images');

    assert.equal(response.status, 401);
    assert.equal(response.body.success, false);
    assert.equal(response.body.message, 'Authentication required');
  });

  it('blocks non-admin upload attempts', async () => {
    const product = await createTestProduct();

    try {
      const response = await request(app)
        .post(`/api/products/${product.id}/images`)
        .set('Authorization', userSession.authHeader)
        .field('makePrimary', 'true');

      assert.equal(response.status, 403);
      assert.equal(response.body.success, false);
      assert.equal(response.body.message, 'You do not have permission to perform this action');
    } finally {
      await cleanupProduct(product.id);
    }
  });

  it('returns a safe validation error when the image file is missing', async () => {
    const product = await createTestProduct();

    try {
      const response = await request(app)
        .post(`/api/products/${product.id}/images`)
        .set('Authorization', adminSession.authHeader)
        .field('altText', 'Missing file test')
        .field('makePrimary', 'true');

      assert.equal(response.status, 400);
      assert.equal(response.body.success, false);
      assert.equal(response.body.message, 'Product image file is required');
    } finally {
      await cleanupProduct(product.id);
    }
  });
});

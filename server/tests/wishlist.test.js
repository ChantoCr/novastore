import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';

import request from 'supertest';

import app from '../src/app.js';
import { dbPool } from '../src/config/db.js';
import { createAuthenticatedSession, userCredentials } from './helpers/auth.js';
import { createTestProduct } from './helpers/checkout.js';
import { registerDatabaseLifecycle } from './helpers/db.js';

registerDatabaseLifecycle();

function hasValidationPath(errors, path) {
  return errors.some((error) => error.path === path);
}

async function cleanupWishlistProduct(productId) {
  await dbPool.query(
    `
      DELETE FROM wishlist_items
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

describe('Wishlist API integration', () => {
  let userSession;

  before(async () => {
    userSession = await createAuthenticatedSession(userCredentials);
  });

  after(async () => {
    await userSession?.logout();
  });

  it('requires authentication for wishlist listing', async () => {
    const response = await request(app).get('/api/wishlist');

    assert.equal(response.status, 401);
    assert.equal(response.body.success, false);
    assert.equal(response.body.message, 'Authentication required');
  });

  it('returns validation errors for an invalid wishlist add payload', async () => {
    const response = await request(app)
      .post('/api/wishlist')
      .set('Authorization', userSession.authHeader)
      .send({
        productId: 'invalid-product-id',
      });

    assert.equal(response.status, 400);
    assert.equal(response.body.success, false);
    assert.equal(response.body.message, 'Validation failed');
    assert.equal(hasValidationPath(response.body.errors, 'productId'), true);
  });

  it('adds and removes a wishlist item for the authenticated user', async () => {
    const product = await createTestProduct({ stock: 4 });

    try {
      const addResponse = await request(app)
        .post('/api/wishlist')
        .set('Authorization', userSession.authHeader)
        .send({
          productId: product.id,
        });

      assert.equal(addResponse.status, 201);
      assert.equal(addResponse.body.success, true);
      assert.equal(addResponse.body.message, 'Product saved to wishlist');
      assert.equal(addResponse.body.data.id, product.id);
      assert.equal(addResponse.body.data.name, product.name);

      const listResponse = await request(app)
        .get('/api/wishlist')
        .set('Authorization', userSession.authHeader);

      assert.equal(listResponse.status, 200);
      assert.equal(listResponse.body.success, true);
      assert.equal(Array.isArray(listResponse.body.data.items), true);
      assert.equal(
        listResponse.body.data.items.some((item) => item.id === product.id && item.name === product.name),
        true,
      );

      const duplicateResponse = await request(app)
        .post('/api/wishlist')
        .set('Authorization', userSession.authHeader)
        .send({
          productId: product.id,
        });

      assert.equal(duplicateResponse.status, 409);
      assert.equal(duplicateResponse.body.success, false);
      assert.equal(duplicateResponse.body.message, 'Product already saved in wishlist');

      const removeResponse = await request(app)
        .delete(`/api/wishlist/${product.id}`)
        .set('Authorization', userSession.authHeader);

      assert.equal(removeResponse.status, 200);
      assert.equal(removeResponse.body.success, true);
      assert.equal(removeResponse.body.message, 'Product removed from wishlist');
      assert.equal(removeResponse.body.data.id, product.id);

      const listAfterRemoveResponse = await request(app)
        .get('/api/wishlist')
        .set('Authorization', userSession.authHeader);

      assert.equal(
        listAfterRemoveResponse.body.data.items.some((item) => item.id === product.id),
        false,
      );
    } finally {
      await cleanupWishlistProduct(product.id);
    }
  });
});

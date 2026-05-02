import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';

import request from 'supertest';

import app from '../src/app.js';
import {
  adminCredentials,
  createAuthenticatedSession,
  userCredentials,
} from './helpers/auth.js';
import { registerDatabaseLifecycle } from './helpers/db.js';

registerDatabaseLifecycle();

function hasValidationPath(errors, path) {
  return errors.some((error) => error.path === path);
}

describe('Product API integration', () => {
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

  it('blocks unauthenticated access to the managed product listing', async () => {
    const response = await request(app).get('/api/products/manage');

    assert.equal(response.status, 401);
    assert.equal(response.body.success, false);
    assert.equal(response.body.message, 'Authentication required');
    assert.deepEqual(response.body.errors, []);
  });

  it('blocks non-admin users from the managed product listing', async () => {
    const response = await request(app)
      .get('/api/products/manage')
      .set('Authorization', userSession.authHeader);

    assert.equal(response.status, 403);
    assert.equal(response.body.success, false);
    assert.equal(response.body.message, 'You do not have permission to perform this action');
    assert.deepEqual(response.body.errors, []);
  });

  it('blocks non-admin users from creating products', async () => {
    const response = await request(app)
      .post('/api/products')
      .set('Authorization', userSession.authHeader)
      .send({
        name: 'Unauthorized Product',
        slug: 'unauthorized-product',
        sku: 'UNAUTHORIZED-001',
        price: 99.99,
      });

    assert.equal(response.status, 403);
    assert.equal(response.body.success, false);
    assert.equal(response.body.message, 'You do not have permission to perform this action');
    assert.deepEqual(response.body.errors, []);
  });

  it('returns validation errors when an admin submits an invalid product create payload', async () => {
    const response = await request(app)
      .post('/api/products')
      .set('Authorization', adminSession.authHeader)
      .send({
        categoryId: 'not-a-number',
        name: 'A',
        slug: 'x',
        sku: '1',
        price: 0,
        stock: -1,
      });

    assert.equal(response.status, 400);
    assert.equal(response.body.success, false);
    assert.equal(response.body.message, 'Validation failed');
    assert.equal(hasValidationPath(response.body.errors, 'categoryId'), true);
    assert.equal(hasValidationPath(response.body.errors, 'name'), true);
    assert.equal(hasValidationPath(response.body.errors, 'slug'), true);
    assert.equal(hasValidationPath(response.body.errors, 'sku'), true);
    assert.equal(hasValidationPath(response.body.errors, 'price'), true);
    assert.equal(hasValidationPath(response.body.errors, 'stock'), true);
  });

  it('returns validation errors when an admin submits an empty product update payload', async () => {
    const response = await request(app)
      .patch('/api/products/non-existent-product')
      .set('Authorization', adminSession.authHeader)
      .send({});

    assert.equal(response.status, 400);
    assert.equal(response.body.success, false);
    assert.equal(response.body.message, 'Validation failed');
    assert.equal(
      response.body.errors.some(
        (error) => error.message === 'At least one field must be provided for update',
      ),
      true,
    );
  });
});

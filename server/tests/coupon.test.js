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

describe('Coupon API integration', () => {
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

  it('blocks unauthenticated access to coupon listing', async () => {
    const response = await request(app).get('/api/coupons');

    assert.equal(response.status, 401);
    assert.equal(response.body.success, false);
    assert.equal(response.body.message, 'Authentication required');
  });

  it('blocks non-admin users from creating coupons', async () => {
    const response = await request(app)
      .post('/api/coupons')
      .set('Authorization', userSession.authHeader)
      .send({
        code: 'USERTRY',
        discountType: 'fixed',
        discountValue: 10,
      });

    assert.equal(response.status, 403);
    assert.equal(response.body.success, false);
    assert.equal(response.body.message, 'You do not have permission to perform this action');
  });

  it('returns validation errors when an admin submits an invalid coupon payload', async () => {
    const response = await request(app)
      .post('/api/coupons')
      .set('Authorization', adminSession.authHeader)
      .send({
        code: 'A',
        discountType: 'invalid-type',
        discountValue: 0,
        minPurchaseAmount: -1,
        usageLimit: 0,
      });

    assert.equal(response.status, 400);
    assert.equal(response.body.success, false);
    assert.equal(response.body.message, 'Validation failed');
    assert.equal(hasValidationPath(response.body.errors, 'code'), true);
    assert.equal(hasValidationPath(response.body.errors, 'discountType'), true);
    assert.equal(hasValidationPath(response.body.errors, 'discountValue'), true);
    assert.equal(hasValidationPath(response.body.errors, 'minPurchaseAmount'), true);
    assert.equal(hasValidationPath(response.body.errors, 'usageLimit'), true);
  });
});

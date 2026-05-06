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

describe('Category API integration', () => {
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

  it('blocks unauthenticated access to the managed category listing', async () => {
    const response = await request(app).get('/api/categories/manage');

    assert.equal(response.status, 401);
    assert.equal(response.body.success, false);
    assert.equal(response.body.message, 'Authentication required');
    assert.deepEqual(response.body.errors, []);
  });

  it('blocks non-admin users from creating categories', async () => {
    const response = await request(app)
      .post('/api/categories')
      .set('Authorization', userSession.authHeader)
      .send({
        name: 'Unauthorized Category',
        slug: 'unauthorized-category',
      });

    assert.equal(response.status, 403);
    assert.equal(response.body.success, false);
    assert.equal(response.body.message, 'You do not have permission to perform this action');
    assert.deepEqual(response.body.errors, []);
  });

  it('returns validation errors when an admin submits an invalid category create payload', async () => {
    const response = await request(app)
      .post('/api/categories')
      .set('Authorization', adminSession.authHeader)
      .send({
        name: 'A',
        slug: 'x',
        description: 'a'.repeat(2001),
        isActive: 'yes',
      });

    assert.equal(response.status, 400);
    assert.equal(response.body.success, false);
    assert.equal(response.body.message, 'Validation failed');
    assert.equal(hasValidationPath(response.body.errors, 'name'), true);
    assert.equal(hasValidationPath(response.body.errors, 'slug'), true);
    assert.equal(hasValidationPath(response.body.errors, 'description'), true);
    assert.equal(hasValidationPath(response.body.errors, 'isActive'), true);
  });

  it('returns validation errors when an admin submits an empty category update payload', async () => {
    const response = await request(app)
      .patch('/api/categories/non-existent-category')
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

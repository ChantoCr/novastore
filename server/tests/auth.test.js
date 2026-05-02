import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import request from 'supertest';

import app from '../src/app.js';
import { adminCredentials, createAuthenticatedSession, loginWithCredentials } from './helpers/auth.js';
import { registerDatabaseLifecycle } from './helpers/db.js';

registerDatabaseLifecycle();

describe('Auth API integration', () => {
  it('logs in successfully with seeded demo credentials', async () => {
    const response = await loginWithCredentials(adminCredentials);

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
    assert.equal(response.body.message, 'Login successful');
    assert.equal(typeof response.body.data.accessToken, 'string');
    assert.equal(typeof response.body.data.refreshToken, 'string');
    assert.equal(response.body.data.user.email, adminCredentials.email);
    assert.equal(response.body.data.user.roles.includes('admin'), true);
    assert.equal('passwordHash' in response.body.data.user, false);

    await request(app).post('/api/auth/logout').send({
      refreshToken: response.body.data.refreshToken,
    });
  });

  it('rejects invalid login credentials safely', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: adminCredentials.email,
      password: 'WrongPassword123!',
    });

    assert.equal(response.status, 401);
    assert.equal(response.body.success, false);
    assert.equal(response.body.message, 'Invalid credentials');
    assert.deepEqual(response.body.errors, []);
  });

  it('requires authentication for GET /api/auth/me', async () => {
    const response = await request(app).get('/api/auth/me');

    assert.equal(response.status, 401);
    assert.equal(response.body.success, false);
    assert.equal(response.body.message, 'Authentication required');
    assert.deepEqual(response.body.errors, []);
  });

  it('returns the authenticated user for GET /api/auth/me', async () => {
    const session = await createAuthenticatedSession(adminCredentials);

    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', session.authHeader);

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
    assert.equal(response.body.message, 'Authenticated user loaded successfully');
    assert.equal(response.body.data.id, session.user.id);
    assert.equal(response.body.data.email, adminCredentials.email);
    assert.equal(response.body.data.roles.includes('admin'), true);
    assert.equal('passwordHash' in response.body.data, false);

    await session.logout();
  });
});

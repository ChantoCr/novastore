import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';

import request from 'supertest';

import app from '../src/app.js';
import { dbPool } from '../src/config/db.js';
import { createAuthenticatedSession, userCredentials } from './helpers/auth.js';
import { registerDatabaseLifecycle } from './helpers/db.js';

registerDatabaseLifecycle();

async function createTestNotification(userId) {
  const [result] = await dbPool.query(
    `
      INSERT INTO notifications (
        user_id,
        type,
        title,
        message,
        metadata
      )
      VALUES (?, ?, ?, ?, ?)
    `,
    [userId, 'order', 'Test notification', 'Notification integration test message', JSON.stringify({ source: 'test' })],
  );

  return result.insertId;
}

async function cleanupTestNotification(notificationId) {
  await dbPool.query(
    `
      DELETE FROM notifications
      WHERE id = ?
    `,
    [notificationId],
  );
}

describe('Notification API integration', () => {
  let userSession;

  before(async () => {
    userSession = await createAuthenticatedSession(userCredentials);
  });

  after(async () => {
    await userSession?.logout();
  });

  it('requires authentication for notifications listing', async () => {
    const response = await request(app).get('/api/notifications');

    assert.equal(response.status, 401);
    assert.equal(response.body.success, false);
    assert.equal(response.body.message, 'Authentication required');
  });

  it('lists notifications and allows the owner to mark one as read', async () => {
    const notificationId = await createTestNotification(userSession.user.id);

    try {
      const listResponse = await request(app)
        .get('/api/notifications')
        .set('Authorization', userSession.authHeader);

      assert.equal(listResponse.status, 200);
      assert.equal(listResponse.body.success, true);
      assert.equal(Array.isArray(listResponse.body.data.items), true);
      assert.equal(listResponse.body.data.summary.unreadCount >= 1, true);

      const readResponse = await request(app)
        .patch(`/api/notifications/${notificationId}/read`)
        .set('Authorization', userSession.authHeader);

      assert.equal(readResponse.status, 200);
      assert.equal(readResponse.body.success, true);
      assert.equal(readResponse.body.message, 'Notification marked as read');
      assert.equal(readResponse.body.data.id, notificationId);
      assert.equal(readResponse.body.data.isRead, true);
    } finally {
      await cleanupTestNotification(notificationId);
    }
  });
});

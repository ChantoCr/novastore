import { dbPool } from '../config/db.js';

function parseJsonField(value) {
  if (!value) {
    return null;
  }

  if (typeof value === 'object') {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function mapNotificationRow(row) {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    title: row.title,
    message: row.message,
    isRead: Boolean(row.is_read),
    metadata: parseJsonField(row.metadata),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function buildNotificationFilters({ userId, status = 'all', type = '' }) {
  const whereClauses = ['n.user_id = ?'];
  const params = [userId];

  if (status === 'read') {
    whereClauses.push('n.is_read = 1');
  } else if (status === 'unread') {
    whereClauses.push('n.is_read = 0');
  }

  if (type) {
    whereClauses.push('n.type = ?');
    params.push(type);
  }

  return {
    whereSql: `WHERE ${whereClauses.join(' AND ')}`,
    params,
  };
}

export async function listNotificationsByUser({ userId, page, limit, status, type }, executor = dbPool) {
  const offset = (page - 1) * limit;
  const { whereSql, params } = buildNotificationFilters({ userId, status, type });

  const [rows] = await executor.query(
    `
      SELECT
        n.id,
        n.user_id,
        n.type,
        n.title,
        n.message,
        n.is_read,
        n.metadata,
        n.created_at,
        n.updated_at
      FROM notifications n
      ${whereSql}
      ORDER BY n.created_at DESC, n.id DESC
      LIMIT ? OFFSET ?
    `,
    [...params, limit, offset],
  );

  return rows.map(mapNotificationRow);
}

export async function countNotificationsByUser({ userId, status, type }, executor = dbPool) {
  const { whereSql, params } = buildNotificationFilters({ userId, status, type });

  const [rows] = await executor.query(
    `
      SELECT COUNT(*) AS total
      FROM notifications n
      ${whereSql}
    `,
    params,
  );

  return Number(rows[0]?.total || 0);
}

export async function countUnreadNotificationsByUser(userId, executor = dbPool) {
  const [rows] = await executor.query(
    `
      SELECT COUNT(*) AS total
      FROM notifications n
      WHERE n.user_id = ?
        AND n.is_read = 0
    `,
    [userId],
  );

  return Number(rows[0]?.total || 0);
}

export async function findNotificationByIdForUser(notificationId, userId, executor = dbPool) {
  const [rows] = await executor.query(
    `
      SELECT
        n.id,
        n.user_id,
        n.type,
        n.title,
        n.message,
        n.is_read,
        n.metadata,
        n.created_at,
        n.updated_at
      FROM notifications n
      WHERE n.id = ?
        AND n.user_id = ?
      LIMIT 1
    `,
    [notificationId, userId],
  );

  return rows[0] ? mapNotificationRow(rows[0]) : null;
}

export async function markNotificationAsReadByIdForUser(notificationId, userId, executor = dbPool) {
  const [result] = await executor.query(
    `
      UPDATE notifications
      SET is_read = 1
      WHERE id = ?
        AND user_id = ?
    `,
    [notificationId, userId],
  );

  return result.affectedRows;
}

export async function markAllNotificationsAsReadByUser(userId, executor = dbPool) {
  const [result] = await executor.query(
    `
      UPDATE notifications
      SET is_read = 1
      WHERE user_id = ?
        AND is_read = 0
    `,
    [userId],
  );

  return result.affectedRows;
}

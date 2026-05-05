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

function mapAuditLogRow(row) {
  return {
    id: row.id,
    adminUserId: row.admin_user_id,
    action: row.action,
    entityType: row.entity_type,
    entityId: row.entity_id,
    oldValue: parseJsonField(row.old_value),
    newValue: parseJsonField(row.new_value),
    ipAddress: row.ip_address,
    userAgent: row.user_agent,
    createdAt: row.created_at,
    adminUser:
      row.admin_name || row.admin_email
        ? {
            id: row.admin_user_id,
            name: row.admin_name || null,
            email: row.admin_email || null,
          }
        : null,
  };
}

export async function createAuditLogRecord(auditLog, executor = dbPool) {
  const [result] = await executor.query(
    `
      INSERT INTO audit_logs (
        admin_user_id,
        action,
        entity_type,
        entity_id,
        old_value,
        new_value,
        ip_address,
        user_agent
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      auditLog.adminUserId,
      auditLog.action,
      auditLog.entityType,
      auditLog.entityId,
      auditLog.oldValue ? JSON.stringify(auditLog.oldValue) : null,
      auditLog.newValue ? JSON.stringify(auditLog.newValue) : null,
      auditLog.ipAddress || null,
      auditLog.userAgent || null,
    ],
  );

  return result.insertId;
}

export async function listAuditLogs({ page, limit, action, entityType, search }) {
  const offset = (page - 1) * limit;
  const whereClauses = ['1 = 1'];
  const params = [];

  if (action && action !== 'all') {
    whereClauses.push('al.action = ?');
    params.push(action);
  }

  if (entityType && entityType !== 'all') {
    whereClauses.push('al.entity_type = ?');
    params.push(entityType);
  }

  if (search) {
    whereClauses.push(
      '(u.name LIKE ? OR u.email LIKE ? OR al.action LIKE ? OR al.entity_type LIKE ? OR CAST(al.entity_id AS CHAR) LIKE ?)',
    );
    params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }

  const [rows] = await dbPool.query(
    `
      SELECT
        al.id,
        al.admin_user_id,
        al.action,
        al.entity_type,
        al.entity_id,
        al.old_value,
        al.new_value,
        al.ip_address,
        al.user_agent,
        al.created_at,
        u.name AS admin_name,
        u.email AS admin_email
      FROM audit_logs al
      INNER JOIN users u ON u.id = al.admin_user_id
      WHERE ${whereClauses.join(' AND ')}
      ORDER BY al.created_at DESC, al.id DESC
      LIMIT ? OFFSET ?
    `,
    [...params, limit, offset],
  );

  return rows.map(mapAuditLogRow);
}

export async function countAuditLogs({ action, entityType, search }) {
  const whereClauses = ['1 = 1'];
  const params = [];

  if (action && action !== 'all') {
    whereClauses.push('al.action = ?');
    params.push(action);
  }

  if (entityType && entityType !== 'all') {
    whereClauses.push('al.entity_type = ?');
    params.push(entityType);
  }

  if (search) {
    whereClauses.push(
      '(u.name LIKE ? OR u.email LIKE ? OR al.action LIKE ? OR al.entity_type LIKE ? OR CAST(al.entity_id AS CHAR) LIKE ?)',
    );
    params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }

  const [rows] = await dbPool.query(
    `
      SELECT COUNT(*) AS total
      FROM audit_logs al
      INNER JOIN users u ON u.id = al.admin_user_id
      WHERE ${whereClauses.join(' AND ')}
    `,
    params,
  );

  return Number(rows[0]?.total || 0);
}

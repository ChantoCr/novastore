import { dbPool } from '../config/db.js';

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

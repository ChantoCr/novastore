import { dbPool } from '../config/db.js';

export async function createRefreshTokenRecord({ userId, tokenHash, expiresAt }) {
  const [result] = await dbPool.query(
    `
      INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
      VALUES (?, ?, ?)
    `,
    [userId, tokenHash, expiresAt],
  );

  return result.insertId;
}

export async function findActiveRefreshTokenRecord({ userId, tokenHash }) {
  const [rows] = await dbPool.query(
    `
      SELECT id, user_id, token_hash, expires_at, revoked_at, created_at
      FROM refresh_tokens
      WHERE user_id = ?
        AND token_hash = ?
        AND revoked_at IS NULL
        AND expires_at > NOW()
      LIMIT 1
    `,
    [userId, tokenHash],
  );

  return rows[0] || null;
}

export async function revokeRefreshTokenByHash({ userId, tokenHash }) {
  const [result] = await dbPool.query(
    `
      UPDATE refresh_tokens
      SET revoked_at = NOW()
      WHERE user_id = ?
        AND token_hash = ?
        AND revoked_at IS NULL
    `,
    [userId, tokenHash],
  );

  return result.affectedRows;
}

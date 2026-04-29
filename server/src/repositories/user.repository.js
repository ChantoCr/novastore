import { dbPool } from '../config/db.js';
import { AppError } from '../utils/appError.js';

const userSelectWithRoles = `
  SELECT
    u.id,
    u.name,
    u.email,
    u.password_hash,
    u.is_active,
    u.created_at,
    u.updated_at,
    COALESCE(GROUP_CONCAT(r.name ORDER BY r.name SEPARATOR ','), '') AS roles
  FROM users u
  LEFT JOIN user_roles ur ON ur.user_id = u.id
  LEFT JOIN roles r ON r.id = ur.role_id
`;

function mapUserRow(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    roles: row.roles ? row.roles.split(',').filter(Boolean) : [],
  };
}

export async function findUserWithRolesByEmail(email) {
  const [rows] = await dbPool.query(
    `${userSelectWithRoles}
     WHERE u.email = ?
     GROUP BY u.id, u.name, u.email, u.password_hash, u.is_active, u.created_at, u.updated_at
     LIMIT 1`,
    [email],
  );

  return rows[0] ? mapUserRow(rows[0]) : null;
}

export async function findUserWithRolesById(userId) {
  const [rows] = await dbPool.query(
    `${userSelectWithRoles}
     WHERE u.id = ?
     GROUP BY u.id, u.name, u.email, u.password_hash, u.is_active, u.created_at, u.updated_at
     LIMIT 1`,
    [userId],
  );

  return rows[0] ? mapUserRow(rows[0]) : null;
}

export async function createUser({ name, email, passwordHash }) {
  const [result] = await dbPool.query(
    `
      INSERT INTO users (name, email, password_hash, is_active)
      VALUES (?, ?, ?, 1)
    `,
    [name, email, passwordHash],
  );

  return result.insertId;
}

export async function assignRoleToUser(userId, roleName) {
  const [result] = await dbPool.query(
    `
      INSERT INTO user_roles (user_id, role_id)
      SELECT ?, id
      FROM roles
      WHERE name = ?
    `,
    [userId, roleName],
  );

  if (!result.affectedRows) {
    throw new AppError(`Role '${roleName}' was not found`, 500);
  }
}

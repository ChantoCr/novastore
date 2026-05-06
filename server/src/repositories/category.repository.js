import { dbPool } from '../config/db.js';

function mapCategoryRow(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    isActive: Boolean(row.is_active),
    productCount:
      typeof row.product_count === 'undefined' || row.product_count === null
        ? undefined
        : Number(row.product_count),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function buildManagedCategoryFilters({ search, status = 'all' }) {
  const whereClauses = ['1 = 1'];
  const params = [];

  if (status === 'active') {
    whereClauses.push('c.is_active = 1');
  } else if (status === 'inactive') {
    whereClauses.push('c.is_active = 0');
  }

  if (search) {
    whereClauses.push('(c.name LIKE ? OR c.slug LIKE ? OR c.description LIKE ?)');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  return {
    whereSql: `WHERE ${whereClauses.join(' AND ')}`,
    params,
  };
}

export async function listActiveCategories() {
  const [rows] = await dbPool.query(
    `
      SELECT c.id, c.name, c.slug, c.description, c.is_active, c.created_at, c.updated_at
      FROM categories c
      WHERE c.is_active = 1
      ORDER BY c.name ASC
    `,
  );

  return rows.map(mapCategoryRow);
}

export async function listManagedCategories({ search, status }, executor = dbPool) {
  const { whereSql, params } = buildManagedCategoryFilters({ search, status });

  const [rows] = await executor.query(
    `
      SELECT
        c.id,
        c.name,
        c.slug,
        c.description,
        c.is_active,
        c.created_at,
        c.updated_at,
        COUNT(p.id) AS product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id AND p.deleted_at IS NULL
      ${whereSql}
      GROUP BY c.id, c.name, c.slug, c.description, c.is_active, c.created_at, c.updated_at
      ORDER BY c.name ASC
    `,
    params,
  );

  return rows.map(mapCategoryRow);
}

export async function findCategoryByIdentifier(
  identifier,
  { includeInactive = true, executor = dbPool } = {},
) {
  const isNumericId = /^\d+$/.test(String(identifier));
  const visibilityFilter = includeInactive ? '1 = 1' : 'c.is_active = 1';

  const [rows] = await executor.query(
    `
      SELECT c.id, c.name, c.slug, c.description, c.is_active, c.created_at, c.updated_at
      FROM categories c
      WHERE ${visibilityFilter}
        AND ${isNumericId ? 'c.id = ?' : 'c.slug = ?'}
      LIMIT 1
    `,
    [identifier],
  );

  return rows[0] ? mapCategoryRow(rows[0]) : null;
}

export async function findCategoryByNameOrSlug(
  { name, slug, excludeId = null },
  executor = dbPool,
) {
  const whereClauses = [];
  const params = [];

  if (name) {
    whereClauses.push('LOWER(c.name) = LOWER(?)');
    params.push(name);
  }

  if (slug) {
    whereClauses.push('c.slug = ?');
    params.push(slug);
  }

  if (!whereClauses.length) {
    return null;
  }

  let sql = `
    SELECT c.id, c.name, c.slug, c.description, c.is_active, c.created_at, c.updated_at
    FROM categories c
    WHERE (${whereClauses.join(' OR ')})
  `;

  if (excludeId) {
    sql += ' AND c.id <> ?';
    params.push(excludeId);
  }

  sql += ' ORDER BY c.id ASC LIMIT 1';

  const [rows] = await executor.query(sql, params);

  return rows[0] ? mapCategoryRow(rows[0]) : null;
}

export async function createCategory(category, executor = dbPool) {
  const [result] = await executor.query(
    `
      INSERT INTO categories (
        name,
        slug,
        description,
        is_active
      )
      VALUES (?, ?, ?, ?)
    `,
    [category.name, category.slug, category.description, category.isActive],
  );

  return result.insertId;
}

export async function updateCategoryByIdentifier(identifier, data, executor = dbPool) {
  const isNumericId = /^\d+$/.test(String(identifier));
  const updates = [];
  const params = [];

  const fieldMap = {
    name: 'name',
    slug: 'slug',
    description: 'description',
    isActive: 'is_active',
  };

  for (const [key, column] of Object.entries(fieldMap)) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      updates.push(`${column} = ?`);
      params.push(data[key]);
    }
  }

  if (!updates.length) {
    return 0;
  }

  params.push(identifier);

  const [result] = await executor.query(
    `
      UPDATE categories
      SET ${updates.join(', ')}
      WHERE ${isNumericId ? 'id = ?' : 'slug = ?'}
    `,
    params,
  );

  return result.affectedRows;
}

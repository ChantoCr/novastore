import { dbPool } from '../config/db.js';

function mapCategoryRow(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listActiveCategories() {
  const [rows] = await dbPool.query(
    `
      SELECT id, name, slug, description, is_active, created_at, updated_at
      FROM categories
      WHERE is_active = 1
      ORDER BY name ASC
    `,
  );

  return rows.map(mapCategoryRow);
}

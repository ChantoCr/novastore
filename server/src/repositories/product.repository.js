import { dbPool } from '../config/db.js';

function mapProductRow(row) {
  return {
    id: row.id,
    categoryId: row.category_id,
    categoryName: row.category_name,
    name: row.name,
    slug: row.slug,
    sku: row.sku,
    description: row.description,
    price: Number(row.price),
    compareAtPrice: row.compare_at_price === null ? null : Number(row.compare_at_price),
    stock: row.stock,
    lowStockThreshold: row.low_stock_threshold,
    isActive: Boolean(row.is_active),
    deletedAt: row.deleted_at,
    primaryImageUrl: row.primary_image_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function buildPublicFilters({ search, category }) {
  const whereClauses = ['p.deleted_at IS NULL', 'p.is_active = 1'];
  const params = [];

  if (search) {
    whereClauses.push('(p.name LIKE ? OR p.description LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }

  if (category) {
    whereClauses.push('(c.slug = ? OR c.name = ?)');
    params.push(category, category);
  }

  return {
    whereSql: whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '',
    params,
  };
}

function getOrderClause(sort) {
  const sortMap = {
    newest: 'p.created_at DESC',
    oldest: 'p.created_at ASC',
    price_asc: 'p.price ASC',
    price_desc: 'p.price DESC',
    name_asc: 'p.name ASC',
    name_desc: 'p.name DESC',
  };

  return sortMap[sort] || sortMap.newest;
}

const productSelect = `
  SELECT
    p.id,
    p.category_id,
    c.name AS category_name,
    p.name,
    p.slug,
    p.sku,
    p.description,
    p.price,
    p.compare_at_price,
    p.stock,
    p.low_stock_threshold,
    p.is_active,
    p.deleted_at,
    p.created_at,
    p.updated_at,
    pi.image_url AS primary_image_url
  FROM products p
  LEFT JOIN categories c ON c.id = p.category_id
  LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = 1
`;

export async function listPublicProducts({ page, limit, search, category, sort }) {
  const { whereSql, params } = buildPublicFilters({ search, category });
  const offset = (page - 1) * limit;
  const orderClause = getOrderClause(sort);

  const [rows] = await dbPool.query(
    `${productSelect}
     ${whereSql}
     ORDER BY ${orderClause}
     LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  );

  return rows.map(mapProductRow);
}

export async function countPublicProducts({ search, category }) {
  const { whereSql, params } = buildPublicFilters({ search, category });

  const [rows] = await dbPool.query(
    `
      SELECT COUNT(*) AS total
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      ${whereSql}
    `,
    params,
  );

  return Number(rows[0]?.total || 0);
}

export async function findProductByIdentifier(identifier, { includeInactive = false } = {}) {
  const isNumericId = /^\d+$/.test(String(identifier));
  const visibilityFilter = includeInactive ? 'p.deleted_at IS NULL' : 'p.deleted_at IS NULL AND p.is_active = 1';

  const [rows] = await dbPool.query(
    `${productSelect}
     WHERE ${visibilityFilter}
       AND ${isNumericId ? 'p.id = ?' : 'p.slug = ?'}
     LIMIT 1`,
    [identifier],
  );

  return rows[0] ? mapProductRow(rows[0]) : null;
}

export async function createProduct(product) {
  const [result] = await dbPool.query(
    `
      INSERT INTO products (
        category_id,
        name,
        slug,
        sku,
        description,
        price,
        compare_at_price,
        stock,
        low_stock_threshold,
        is_active
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      product.categoryId,
      product.name,
      product.slug,
      product.sku,
      product.description,
      product.price,
      product.compareAtPrice,
      product.stock,
      product.lowStockThreshold,
      product.isActive,
    ],
  );

  return result.insertId;
}

export async function updateProductByIdentifier(identifier, data) {
  const isNumericId = /^\d+$/.test(String(identifier));
  const updates = [];
  const params = [];

  const fieldMap = {
    categoryId: 'category_id',
    name: 'name',
    slug: 'slug',
    sku: 'sku',
    description: 'description',
    price: 'price',
    compareAtPrice: 'compare_at_price',
    stock: 'stock',
    lowStockThreshold: 'low_stock_threshold',
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

  const [result] = await dbPool.query(
    `
      UPDATE products
      SET ${updates.join(', ')}
      WHERE deleted_at IS NULL
        AND ${isNumericId ? 'id = ?' : 'slug = ?'}
    `,
    params,
  );

  return result.affectedRows;
}

export async function softDeleteProductByIdentifier(identifier) {
  const isNumericId = /^\d+$/.test(String(identifier));

  const [result] = await dbPool.query(
    `
      UPDATE products
      SET is_active = 0,
          deleted_at = NOW()
      WHERE deleted_at IS NULL
        AND ${isNumericId ? 'id = ?' : 'slug = ?'}
    `,
    [identifier],
  );

  return result.affectedRows;
}

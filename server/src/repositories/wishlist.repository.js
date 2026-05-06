import { dbPool } from '../config/db.js';

function mapWishlistRow(row) {
  return {
    id: row.product_id,
    wishlistItemId: row.wishlist_item_id,
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
    wishlistAddedAt: row.wishlist_added_at,
  };
}

const wishlistSelect = `
  SELECT
    wi.id AS wishlist_item_id,
    wi.created_at AS wishlist_added_at,
    p.id AS product_id,
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
  FROM wishlist_items wi
  INNER JOIN products p ON p.id = wi.product_id
  LEFT JOIN categories c ON c.id = p.category_id
  LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = 1
`;

export async function listWishlistItemsByUser(userId, executor = dbPool) {
  const [rows] = await executor.query(
    `${wishlistSelect}
     WHERE wi.user_id = ?
       AND p.deleted_at IS NULL
       AND p.is_active = 1
     ORDER BY wi.created_at DESC, wi.id DESC`,
    [userId],
  );

  return rows.map(mapWishlistRow);
}

export async function countWishlistItemsByUser(userId, executor = dbPool) {
  const [rows] = await executor.query(
    `
      SELECT COUNT(*) AS total
      FROM wishlist_items wi
      INNER JOIN products p ON p.id = wi.product_id
      WHERE wi.user_id = ?
        AND p.deleted_at IS NULL
        AND p.is_active = 1
    `,
    [userId],
  );

  return Number(rows[0]?.total || 0);
}

export async function findWishlistItemByUserAndProduct(userId, productId, executor = dbPool) {
  const [rows] = await executor.query(
    `${wishlistSelect}
     WHERE wi.user_id = ?
       AND wi.product_id = ?
     LIMIT 1`,
    [userId, productId],
  );

  return rows[0] ? mapWishlistRow(rows[0]) : null;
}

export async function createWishlistItem(userId, productId, executor = dbPool) {
  const [result] = await executor.query(
    `
      INSERT INTO wishlist_items (
        user_id,
        product_id
      )
      VALUES (?, ?)
    `,
    [userId, productId],
  );

  return result.insertId;
}

export async function deleteWishlistItemByUserAndProduct(userId, productId, executor = dbPool) {
  const [result] = await executor.query(
    `
      DELETE FROM wishlist_items
      WHERE user_id = ?
        AND product_id = ?
    `,
    [userId, productId],
  );

  return result.affectedRows;
}

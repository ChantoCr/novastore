import { dbPool } from '../config/db.js';

function mapProductImageRow(row) {
  return {
    id: row.id,
    productId: row.product_id,
    imageUrl: row.image_url,
    altText: row.alt_text,
    isPrimary: Boolean(row.is_primary),
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listProductImagesByProductId(productId, executor = dbPool) {
  const [rows] = await executor.query(
    `
      SELECT
        id,
        product_id,
        image_url,
        alt_text,
        is_primary,
        sort_order,
        created_at,
        updated_at
      FROM product_images
      WHERE product_id = ?
      ORDER BY is_primary DESC, sort_order ASC, id ASC
    `,
    [productId],
  );

  return rows.map(mapProductImageRow);
}

export async function findProductImageById(imageId, executor = dbPool) {
  const [rows] = await executor.query(
    `
      SELECT
        id,
        product_id,
        image_url,
        alt_text,
        is_primary,
        sort_order,
        created_at,
        updated_at
      FROM product_images
      WHERE id = ?
      LIMIT 1
    `,
    [imageId],
  );

  return rows[0] ? mapProductImageRow(rows[0]) : null;
}

export async function clearPrimaryProductImagesByProductId(productId, executor = dbPool) {
  const [result] = await executor.query(
    `
      UPDATE product_images
      SET is_primary = 0
      WHERE product_id = ?
        AND is_primary = 1
    `,
    [productId],
  );

  return result.affectedRows;
}

export async function createProductImageRecord(image, executor = dbPool) {
  const [result] = await executor.query(
    `
      INSERT INTO product_images (
        product_id,
        image_url,
        alt_text,
        is_primary,
        sort_order
      )
      VALUES (?, ?, ?, ?, ?)
    `,
    [image.productId, image.imageUrl, image.altText, image.isPrimary, image.sortOrder],
  );

  return result.insertId;
}

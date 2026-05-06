import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

import { dbPool } from '../config/db.js';
import { buildPublicUploadUrl, uploadConfig } from '../config/uploads.js';
import { createAuditLogRecord } from '../repositories/audit.repository.js';
import { findProductByIdentifier } from '../repositories/product.repository.js';
import {
  clearPrimaryProductImagesByProductId,
  createProductImageRecord,
  findProductImageById,
  listProductImagesByProductId,
} from '../repositories/productImage.repository.js';
import { AppError } from '../utils/appError.js';

function getFileExtension(file) {
  const extensionFromName = path.extname(file.originalname || '').toLowerCase();

  if (extensionFromName) {
    return extensionFromName;
  }

  const mimeExtensionMap = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
  };

  return mimeExtensionMap[file.mimetype] || '.bin';
}

function buildStoredFileName(file) {
  return `${Date.now()}-${crypto.randomUUID()}${getFileExtension(file)}`;
}

function buildActorContext(actor) {
  return {
    adminUserId: actor.adminUserId,
    ipAddress: actor.ipAddress,
    userAgent: actor.userAgent,
  };
}

function normalizeImagePayload(payload) {
  return {
    altText: payload.altText?.trim() || null,
    makePrimary: Boolean(payload.makePrimary),
  };
}

export async function uploadProductImageForAdmin(identifier, payload, actor) {
  if (!payload.file) {
    throw new AppError('Product image file is required', 400);
  }

  const normalizedPayload = normalizeImagePayload(payload);
  const connection = await dbPool.getConnection();
  let absoluteFilePath = null;

  try {
    await connection.beginTransaction();

    const product = await findProductByIdentifier(identifier, {
      includeInactive: true,
      executor: connection,
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const existingImages = await listProductImagesByProductId(product.id, connection);
    const shouldMakePrimary = normalizedPayload.makePrimary || existingImages.length === 0;
    const storedFileName = buildStoredFileName(payload.file);
    const relativeFilePath = path.posix.join('products', String(product.id), storedFileName);
    absoluteFilePath = path.join(uploadConfig.absoluteUploadDir, relativeFilePath);

    await fs.mkdir(path.dirname(absoluteFilePath), { recursive: true });
    await fs.writeFile(absoluteFilePath, payload.file.buffer);

    if (shouldMakePrimary) {
      await clearPrimaryProductImagesByProductId(product.id, connection);
    }

    const imageId = await createProductImageRecord(
      {
        productId: product.id,
        imageUrl: buildPublicUploadUrl(relativeFilePath),
        altText: normalizedPayload.altText || product.name,
        isPrimary: shouldMakePrimary,
        sortOrder: existingImages.length + 1,
      },
      connection,
    );

    const uploadedImage = await findProductImageById(imageId, connection);
    const updatedProduct = await findProductByIdentifier(String(product.id), {
      includeInactive: true,
      executor: connection,
    });

    if (!uploadedImage || !updatedProduct) {
      throw new AppError('Uploaded product image could not be loaded', 500);
    }

    await createAuditLogRecord(
      {
        ...buildActorContext(actor),
        action: 'product_image_uploaded',
        entityType: 'product',
        entityId: product.id,
        oldValue: {
          primaryImageUrl: product.primaryImageUrl,
        },
        newValue: {
          primaryImageUrl: updatedProduct.primaryImageUrl,
          uploadedImage,
        },
      },
      connection,
    );

    await connection.commit();

    return {
      product: updatedProduct,
      image: uploadedImage,
    };
  } catch (error) {
    await connection.rollback();

    if (absoluteFilePath) {
      await fs.unlink(absoluteFilePath).catch(() => {});
    }

    throw error;
  } finally {
    connection.release();
  }
}

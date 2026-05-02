import { dbPool } from '../config/db.js';
import { createAuditLogRecord } from '../repositories/audit.repository.js';
import {
  countManagedProducts,
  countPublicProducts,
  createProduct,
  createStockMovementRecord,
  findProductByIdentifier,
  listManagedProducts,
  listPublicProducts,
  softDeleteProductByIdentifier,
  updateProductByIdentifier,
  updateProductStockByIdentifier,
} from '../repositories/product.repository.js';
import { AppError } from '../utils/appError.js';

function buildAuditContext(actor) {
  return {
    adminUserId: actor.adminUserId,
    ipAddress: actor.ipAddress,
    userAgent: actor.userAgent,
  };
}

function buildMovementType(quantityChange) {
  return quantityChange > 0 ? 'restock' : 'adjustment';
}

function stripUndefinedEntries(object) {
  return Object.fromEntries(Object.entries(object).filter(([, value]) => value !== undefined));
}

export async function getPublicProducts(query) {
  const page = query.page || 1;
  const limit = query.limit || 12;

  const [items, totalItems] = await Promise.all([
    listPublicProducts({
      page,
      limit,
      search: query.search,
      category: query.category,
      sort: query.sort,
    }),
    countPublicProducts({
      search: query.search,
      category: query.category,
    }),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / limit)),
    },
    filters: {
      search: query.search || null,
      category: query.category || null,
      sort: query.sort || 'newest',
    },
  };
}

export async function getManagedProducts(query) {
  const page = query.page || 1;
  const limit = query.limit || 12;

  const [items, totalItems] = await Promise.all([
    listManagedProducts({
      page,
      limit,
      search: query.search,
      category: query.category,
      sort: query.sort,
      status: query.status,
    }),
    countManagedProducts({
      search: query.search,
      category: query.category,
      status: query.status,
    }),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / limit)),
    },
    filters: {
      search: query.search || null,
      category: query.category || null,
      sort: query.sort || 'newest',
      status: query.status || 'all',
    },
  };
}

export async function getPublicProduct(identifier) {
  const product = await findProductByIdentifier(identifier);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  return product;
}

export async function createProductRecord(payload, actor) {
  const connection = await dbPool.getConnection();

  try {
    await connection.beginTransaction();

    const productId = await createProduct(payload, connection);
    const product = await findProductByIdentifier(String(productId), {
      includeInactive: true,
      executor: connection,
    });

    if (!product) {
      throw new AppError('Product created but could not be loaded', 500);
    }

    if (payload.stock > 0) {
      await createStockMovementRecord(
        {
          productId: product.id,
          adminUserId: actor.adminUserId,
          movementType: 'restock',
          quantityChange: payload.stock,
          previousStock: 0,
          newStock: payload.stock,
          reason: 'Initial product stock creation',
        },
        connection,
      );
    }

    await createAuditLogRecord(
      {
        ...buildAuditContext(actor),
        action: 'product_created',
        entityType: 'product',
        entityId: product.id,
        oldValue: null,
        newValue: product,
      },
      connection,
    );

    await connection.commit();

    return product;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function updateProductRecord(identifier, payload, actor) {
  const connection = await dbPool.getConnection();

  try {
    await connection.beginTransaction();

    const currentProduct = await findProductByIdentifier(identifier, {
      includeInactive: true,
      executor: connection,
    });

    if (!currentProduct) {
      throw new AppError('Product not found or no changes were applied', 404);
    }

    const affectedRows = await updateProductByIdentifier(identifier, payload, connection);

    if (!affectedRows) {
      throw new AppError('Product not found or no changes were applied', 404);
    }

    const product = await findProductByIdentifier(String(currentProduct.id), {
      includeInactive: true,
      executor: connection,
    });

    if (!product) {
      throw new AppError('Product updated but could not be loaded', 500);
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'stock') && payload.stock !== currentProduct.stock) {
      const quantityChange = payload.stock - currentProduct.stock;

      await createStockMovementRecord(
        {
          productId: product.id,
          adminUserId: actor.adminUserId,
          movementType: buildMovementType(quantityChange),
          quantityChange,
          previousStock: currentProduct.stock,
          newStock: payload.stock,
          reason: payload.stockChangeReason || 'Stock changed through product update',
        },
        connection,
      );
    }

    const action =
      Object.keys(payload).length === 1 && Object.prototype.hasOwnProperty.call(payload, 'isActive')
        ? 'product_status_changed'
        : 'product_updated';

    await createAuditLogRecord(
      {
        ...buildAuditContext(actor),
        action,
        entityType: 'product',
        entityId: product.id,
        oldValue: currentProduct,
        newValue: product,
      },
      connection,
    );

    await connection.commit();

    return product;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function adjustProductStockRecord(identifier, payload, actor) {
  const connection = await dbPool.getConnection();

  try {
    await connection.beginTransaction();

    const currentProduct = await findProductByIdentifier(identifier, {
      includeInactive: true,
      executor: connection,
    });

    if (!currentProduct) {
      throw new AppError('Product not found', 404);
    }

    const newStock = currentProduct.stock + payload.quantityChange;

    if (newStock < 0) {
      throw new AppError('Stock adjustment would make inventory negative', 409);
    }

    const affectedRows = await updateProductStockByIdentifier(identifier, newStock, connection);

    if (!affectedRows) {
      throw new AppError('Product stock could not be updated', 404);
    }

    const updatedProduct = await findProductByIdentifier(String(currentProduct.id), {
      includeInactive: true,
      executor: connection,
    });

    if (!updatedProduct) {
      throw new AppError('Updated product could not be loaded', 500);
    }

    await createStockMovementRecord(
      {
        productId: updatedProduct.id,
        adminUserId: actor.adminUserId,
        movementType: buildMovementType(payload.quantityChange),
        quantityChange: payload.quantityChange,
        previousStock: currentProduct.stock,
        newStock,
        reason: payload.reason || 'Admin stock adjustment',
      },
      connection,
    );

    await createAuditLogRecord(
      {
        ...buildAuditContext(actor),
        action: 'product_stock_adjusted',
        entityType: 'product',
        entityId: updatedProduct.id,
        oldValue: stripUndefinedEntries({
          stock: currentProduct.stock,
          lowStockThreshold: currentProduct.lowStockThreshold,
        }),
        newValue: stripUndefinedEntries({
          stock: updatedProduct.stock,
          lowStockThreshold: updatedProduct.lowStockThreshold,
          quantityChange: payload.quantityChange,
          reason: payload.reason || null,
        }),
      },
      connection,
    );

    await connection.commit();

    return updatedProduct;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function deactivateProductRecord(identifier, actor) {
  const connection = await dbPool.getConnection();

  try {
    await connection.beginTransaction();

    const currentProduct = await findProductByIdentifier(identifier, {
      includeInactive: true,
      executor: connection,
    });

    if (!currentProduct) {
      throw new AppError('Product not found', 404);
    }

    const affectedRows = await softDeleteProductByIdentifier(identifier, connection);

    if (!affectedRows) {
      throw new AppError('Product not found', 404);
    }

    await createAuditLogRecord(
      {
        ...buildAuditContext(actor),
        action: 'product_soft_deleted',
        entityType: 'product',
        entityId: currentProduct.id,
        oldValue: currentProduct,
        newValue: {
          ...currentProduct,
          isActive: false,
          deleted: true,
        },
      },
      connection,
    );

    await connection.commit();

    return {
      identifier,
      deleted: true,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

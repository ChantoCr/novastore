import {
  countManagedProducts,
  countPublicProducts,
  createProduct,
  findProductByIdentifier,
  listManagedProducts,
  listPublicProducts,
  softDeleteProductByIdentifier,
  updateProductByIdentifier,
} from '../repositories/product.repository.js';
import { AppError } from '../utils/appError.js';

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

export async function createProductRecord(payload) {
  const productId = await createProduct(payload);
  const product = await findProductByIdentifier(String(productId), { includeInactive: true });

  if (!product) {
    throw new AppError('Product created but could not be loaded', 500);
  }

  return product;
}

export async function updateProductRecord(identifier, payload) {
  const affectedRows = await updateProductByIdentifier(identifier, payload);

  if (!affectedRows) {
    throw new AppError('Product not found or no changes were applied', 404);
  }

  const product = await findProductByIdentifier(identifier, { includeInactive: true });

  if (!product) {
    throw new AppError('Product updated but could not be loaded', 500);
  }

  return product;
}

export async function deactivateProductRecord(identifier) {
  const affectedRows = await softDeleteProductByIdentifier(identifier);

  if (!affectedRows) {
    throw new AppError('Product not found', 404);
  }

  return {
    identifier,
    deleted: true,
  };
}

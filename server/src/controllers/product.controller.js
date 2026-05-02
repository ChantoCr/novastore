import { successResponse } from '../utils/apiResponse.js';
import {
  adjustProductStockRecord,
  createProductRecord,
  deactivateProductRecord,
  getManagedProducts,
  getPublicProduct,
  getPublicProducts,
  updateProductRecord,
} from '../services/product.service.js';

function buildActorContext(req) {
  return {
    adminUserId: req.user.id,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
  };
}

export async function listProducts(req, res) {
  const data = await getPublicProducts(req.query);

  res.status(200).json(
    successResponse({
      message: 'Products loaded successfully',
      data,
    }),
  );
}

export async function listManagedProducts(req, res) {
  const data = await getManagedProducts(req.query);

  res.status(200).json(
    successResponse({
      message: 'Managed products loaded successfully',
      data,
    }),
  );
}

export async function getProduct(req, res) {
  const data = await getPublicProduct(req.params.productIdOrSlug);

  res.status(200).json(
    successResponse({
      message: 'Product loaded successfully',
      data,
    }),
  );
}

export async function createProduct(req, res) {
  const data = await createProductRecord(req.body, buildActorContext(req));

  res.status(201).json(
    successResponse({
      message: 'Product created successfully',
      data,
    }),
  );
}

export async function updateProduct(req, res) {
  const data = await updateProductRecord(
    req.params.productIdOrSlug,
    req.body,
    buildActorContext(req),
  );

  res.status(200).json(
    successResponse({
      message: 'Product updated successfully',
      data,
    }),
  );
}

export async function adjustProductStock(req, res) {
  const data = await adjustProductStockRecord(
    req.params.productIdOrSlug,
    req.body,
    buildActorContext(req),
  );

  res.status(200).json(
    successResponse({
      message: 'Product stock adjusted successfully',
      data,
    }),
  );
}

export async function deleteProduct(req, res) {
  const data = await deactivateProductRecord(req.params.productIdOrSlug, buildActorContext(req));

  res.status(200).json(
    successResponse({
      message: 'Product deactivated successfully',
      data,
    }),
  );
}

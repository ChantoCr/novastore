import { successResponse } from '../utils/apiResponse.js';
import {
  createCategoryRecord,
  getActiveCategories,
  getManagedCategories,
  updateCategoryRecord,
} from '../services/category.service.js';

function buildActorContext(req) {
  return {
    adminUserId: req.user.id,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
  };
}

export async function listCategories(_req, res) {
  const data = await getActiveCategories();

  res.status(200).json(
    successResponse({
      message: 'Categories loaded successfully',
      data,
    }),
  );
}

export async function listManagedCategories(req, res) {
  const data = await getManagedCategories(req.query);

  res.status(200).json(
    successResponse({
      message: 'Managed categories loaded successfully',
      data,
    }),
  );
}

export async function createCategory(req, res) {
  const data = await createCategoryRecord(req.body, buildActorContext(req));

  res.status(201).json(
    successResponse({
      message: 'Category created successfully',
      data,
    }),
  );
}

export async function updateCategory(req, res) {
  const data = await updateCategoryRecord(
    req.params.categoryIdOrSlug,
    req.body,
    buildActorContext(req),
  );

  res.status(200).json(
    successResponse({
      message: 'Category updated successfully',
      data,
    }),
  );
}

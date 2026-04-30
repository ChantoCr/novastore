import { successResponse } from '../utils/apiResponse.js';
import { getActiveCategories } from '../services/category.service.js';

export async function listCategories(_req, res) {
  const data = await getActiveCategories();

  res.status(200).json(
    successResponse({
      message: 'Categories loaded successfully',
      data,
    }),
  );
}

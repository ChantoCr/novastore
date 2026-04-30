import { listActiveCategories } from '../repositories/category.repository.js';

export async function getActiveCategories() {
  return listActiveCategories();
}

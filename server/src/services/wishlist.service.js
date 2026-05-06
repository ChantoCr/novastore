import { findProductByIdentifier } from '../repositories/product.repository.js';
import {
  countWishlistItemsByUser,
  createWishlistItem,
  deleteWishlistItemByUserAndProduct,
  findWishlistItemByUserAndProduct,
  listWishlistItemsByUser,
} from '../repositories/wishlist.repository.js';
import { AppError } from '../utils/appError.js';

function mapWishlistMutationError(error) {
  if (error?.code === 'ER_DUP_ENTRY') {
    return new AppError('Product already saved in wishlist', 409);
  }

  return error;
}

export async function getWishlistForUser(userId) {
  const [items, itemCount] = await Promise.all([
    listWishlistItemsByUser(userId),
    countWishlistItemsByUser(userId),
  ]);

  return {
    items,
    summary: {
      itemCount,
    },
  };
}

export async function addWishlistItemForUser(userId, payload) {
  const product = await findProductByIdentifier(String(payload.productId));

  if (!product) {
    throw new AppError('Product not found or unavailable for wishlist', 404);
  }

  const existingItem = await findWishlistItemByUserAndProduct(userId, payload.productId);

  if (existingItem) {
    throw new AppError('Product already saved in wishlist', 409);
  }

  try {
    await createWishlistItem(userId, payload.productId);
  } catch (error) {
    throw mapWishlistMutationError(error);
  }

  const wishlistItem = await findWishlistItemByUserAndProduct(userId, payload.productId);

  if (!wishlistItem) {
    throw new AppError('Wishlist item was created but could not be loaded', 500);
  }

  return wishlistItem;
}

export async function removeWishlistItemForUser(userId, productId) {
  const wishlistItem = await findWishlistItemByUserAndProduct(userId, productId);

  if (!wishlistItem) {
    throw new AppError('Wishlist item not found', 404);
  }

  const affectedRows = await deleteWishlistItemByUserAndProduct(userId, productId);

  if (!affectedRows) {
    throw new AppError('Wishlist item could not be removed', 404);
  }

  return wishlistItem;
}

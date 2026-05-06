import { successResponse } from '../utils/apiResponse.js';
import {
  addWishlistItemForUser,
  getWishlistForUser,
  removeWishlistItemForUser,
} from '../services/wishlist.service.js';

export async function listWishlist(req, res) {
  const data = await getWishlistForUser(req.user.id);

  res.status(200).json(
    successResponse({
      message: 'Wishlist loaded successfully',
      data,
    }),
  );
}

export async function addWishlistItem(req, res) {
  const data = await addWishlistItemForUser(req.user.id, req.body);

  res.status(201).json(
    successResponse({
      message: 'Product saved to wishlist',
      data,
    }),
  );
}

export async function removeWishlistItem(req, res) {
  const data = await removeWishlistItemForUser(req.user.id, req.params.productId);

  res.status(200).json(
    successResponse({
      message: 'Product removed from wishlist',
      data,
    }),
  );
}

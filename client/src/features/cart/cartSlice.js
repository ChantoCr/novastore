import { createSlice } from '@reduxjs/toolkit';

import { loadCartState } from './cartStorage.js';

const initialState = loadCartState();

function clampQuantity(quantity, stock) {
  if (typeof stock === 'number' && stock >= 0) {
    return Math.max(1, Math.min(quantity, stock));
  }

  return Math.max(1, quantity);
}

function mapProductToCartItem(product, quantity) {
  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    sku: product.sku,
    price: product.price,
    stock: product.stock,
    categoryName: product.categoryName || 'Uncategorized',
    primaryImageUrl: product.primaryImageUrl || null,
    quantity,
  };
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { product, quantity = 1 } = action.payload;

      if (!product?.id || product.stock <= 0) {
        return;
      }

      const existingItem = state.items.find((item) => item.productId === product.id);

      if (existingItem) {
        existingItem.stock = product.stock;
        existingItem.price = product.price;
        existingItem.name = product.name;
        existingItem.slug = product.slug;
        existingItem.sku = product.sku;
        existingItem.categoryName = product.categoryName || existingItem.categoryName;
        existingItem.primaryImageUrl = product.primaryImageUrl || existingItem.primaryImageUrl;
        existingItem.quantity = clampQuantity(existingItem.quantity + quantity, product.stock);
        return;
      }

      state.items.push(mapProductToCartItem(product, clampQuantity(quantity, product.stock)));
    },
    updateItemQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((entry) => entry.productId === productId);

      if (!item) {
        return;
      }

      if (quantity <= 0) {
        state.items = state.items.filter((entry) => entry.productId !== productId);
        return;
      }

      item.quantity = clampQuantity(quantity, item.stock);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.productId !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, updateItemQuantity, removeItem, clearCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartItemCount = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
export const selectCartSummary = (state) => ({
  items: state.cart.items,
  itemCount: selectCartItemCount(state),
  subtotal: selectCartSubtotal(state),
});

export default cartSlice.reducer;

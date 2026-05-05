import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/auth/authSlice.js';
import { saveAuthSession } from '../features/auth/authStorage.js';
import cartReducer from '../features/cart/cartSlice.js';
import { saveCartState } from '../features/cart/cartStorage.js';
import uiReducer from '../features/ui/uiSlice.js';
import { baseApi } from '../services/baseApi.js';
import themeReducer from './themeSlice.js';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    cart: cartReducer,
    theme: themeReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});

let previousRefreshToken = store.getState().auth.refreshToken;

store.subscribe(() => {
  const state = store.getState();
  const currentRefreshToken = state.auth.refreshToken;

  saveCartState(state.cart);

  if (currentRefreshToken !== previousRefreshToken) {
    saveAuthSession({ refreshToken: currentRefreshToken });
    previousRefreshToken = currentRefreshToken;
  }
});

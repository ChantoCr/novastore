import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/auth/authSlice.js';
import cartReducer from '../features/cart/cartSlice.js';
import { saveCartState } from '../features/cart/cartStorage.js';
import { baseApi } from '../services/baseApi.js';
import themeReducer from './themeSlice.js';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    cart: cartReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});

store.subscribe(() => {
  saveCartState(store.getState().cart);
});

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  toasts: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addToast: {
      reducer: (state, action) => {
        state.toasts.push(action.payload);
      },
      prepare: ({ title, message, type = 'success', duration = 2800 }) => ({
        payload: {
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          title,
          message,
          type,
          duration,
        },
      }),
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
  },
});

export const { addToast, removeToast, clearToasts } = uiSlice.actions;
export const selectToasts = (state) => state.ui.toasts;
export default uiSlice.reducer;

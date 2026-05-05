import { createSlice } from '@reduxjs/toolkit';

import { loadAuthSession } from './authStorage.js';

function createLoggedOutState({ refreshToken = null, authBootstrapStatus = 'complete' } = {}) {
  return {
    user: null,
    accessToken: null,
    refreshToken,
    isAuthenticated: false,
    role: null,
    authBootstrapStatus,
  };
}

const persistedAuthSession = loadAuthSession();

const initialState = createLoggedOutState({
  refreshToken: persistedAuthSession.refreshToken,
  authBootstrapStatus: persistedAuthSession.refreshToken ? 'pending' : 'complete',
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;

      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken || state.refreshToken;
      state.isAuthenticated = Boolean(user && accessToken);
      state.role = user?.roles?.[0] || null;
      state.authBootstrapStatus = 'complete';
    },
    authBootstrapStarted: (state) => {
      state.authBootstrapStatus = 'loading';
    },
    clearCredentials: () => createLoggedOutState(),
  },
});

export const { setCredentials, authBootstrapStarted, clearCredentials } = authSlice.actions;
export const selectAuthBootstrapStatus = (state) => state.auth.authBootstrapStatus;
export const selectIsAuthBootstrapComplete = (state) => state.auth.authBootstrapStatus === 'complete';
export default authSlice.reducer;

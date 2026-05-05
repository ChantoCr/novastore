import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { clearCredentials, setCredentials } from '../features/auth/authSlice.js';

const REAUTH_EXCLUDED_PATHS = new Set([
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/logout',
]);

function getRequestUrl(args) {
  if (typeof args === 'string') {
    return args;
  }

  return args?.url || '';
}

function shouldAttemptReauth(args) {
  return !REAUTH_EXCLUDED_PATHS.has(getRequestUrl(args));
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401 && shouldAttemptReauth(args)) {
    const refreshToken = api.getState().auth.refreshToken;

    if (refreshToken) {
      const refreshResult = await rawBaseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions,
      );

      if (refreshResult.data?.data) {
        api.dispatch(setCredentials(refreshResult.data.data));
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        api.dispatch(clearCredentials());
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'Products', 'ManagedProducts', 'Categories', 'Orders', 'AuditLogs'],
  endpoints: () => ({}),
});

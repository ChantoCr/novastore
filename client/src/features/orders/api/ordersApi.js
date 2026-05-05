import { baseApi } from '../../../services/baseApi.js';

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyOrders: builder.query({
      query: (params = {}) => ({
        url: '/orders',
        params,
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map((order) => ({ type: 'Orders', id: order.id })),
              { type: 'Orders', id: 'LIST' },
            ]
          : [{ type: 'Orders', id: 'LIST' }],
    }),
    getMyOrderById: builder.query({
      query: (orderId) => `/orders/${orderId}`,
      providesTags: (_result, _error, orderId) => [{ type: 'Orders', id: orderId }],
    }),
    getAdminOrders: builder.query({
      query: (params = {}) => ({
        url: '/orders/admin',
        params,
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map((order) => ({ type: 'Orders', id: `ADMIN-${order.id}` })),
              { type: 'Orders', id: 'ADMIN-LIST' },
            ]
          : [{ type: 'Orders', id: 'ADMIN-LIST' }],
    }),
    getAdminOrderById: builder.query({
      query: (orderId) => `/orders/admin/${orderId}`,
      providesTags: (_result, _error, orderId) => [{ type: 'Orders', id: `ADMIN-${orderId}` }],
    }),
    updateAdminOrderStatus: builder.mutation({
      query: ({ orderId, ...payload }) => ({
        url: `/orders/admin/${orderId}/status`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: (_result, _error, { orderId }) => [
        { type: 'Orders', id: `ADMIN-${orderId}` },
        { type: 'Orders', id: 'ADMIN-LIST' },
        { type: 'Orders', id: orderId },
        { type: 'Orders', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetMyOrderByIdQuery,
  useGetMyOrdersQuery,
  useGetAdminOrdersQuery,
  useGetAdminOrderByIdQuery,
  useUpdateAdminOrderStatusMutation,
} = ordersApi;

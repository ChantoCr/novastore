import { baseApi } from '../../../services/baseApi.js';

export const couponsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCoupons: builder.query({
      query: (params = {}) => ({
        url: '/coupons',
        params,
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map((coupon) => ({ type: 'Coupons', id: coupon.id })),
              { type: 'Coupons', id: 'LIST' },
            ]
          : [{ type: 'Coupons', id: 'LIST' }],
    }),
    createCoupon: builder.mutation({
      query: (payload) => ({
        url: '/coupons',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'Coupons', id: 'LIST' }, { type: 'AuditLogs', id: 'LIST' }],
    }),
    updateCoupon: builder.mutation({
      query: ({ couponId, ...payload }) => ({
        url: `/coupons/${couponId}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: (_result, _error, { couponId }) => [
        { type: 'Coupons', id: couponId },
        { type: 'Coupons', id: 'LIST' },
        { type: 'AuditLogs', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useCreateCouponMutation,
  useGetCouponsQuery,
  useUpdateCouponMutation,
} = couponsApi;

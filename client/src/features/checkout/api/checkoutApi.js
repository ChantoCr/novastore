import { baseApi } from '../../../services/baseApi.js';

export const checkoutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCheckout: builder.mutation({
      query: (payload) => ({
        url: '/checkout',
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

export const { useCreateCheckoutMutation } = checkoutApi;

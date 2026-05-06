import { baseApi } from '../../../services/baseApi.js';

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query({
      query: () => '/wishlist',
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map((product) => ({ type: 'Wishlist', id: product.id })),
              { type: 'Wishlist', id: 'LIST' },
            ]
          : [{ type: 'Wishlist', id: 'LIST' }],
    }),
    addWishlistItem: builder.mutation({
      query: (payload) => ({
        url: '/wishlist',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: 'Wishlist', id: productId },
        { type: 'Wishlist', id: 'LIST' },
      ],
    }),
    removeWishlistItem: builder.mutation({
      query: (productId) => ({
        url: `/wishlist/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, productId) => [
        { type: 'Wishlist', id: productId },
        { type: 'Wishlist', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useAddWishlistItemMutation,
  useGetWishlistQuery,
  useRemoveWishlistItemMutation,
} = wishlistApi;

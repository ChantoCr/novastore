import { baseApi } from '../../../services/baseApi.js';

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params = {}) => ({
        url: '/products',
        params,
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map((product) => ({ type: 'Products', id: product.id })),
              { type: 'Products', id: 'LIST' },
            ]
          : [{ type: 'Products', id: 'LIST' }],
    }),
    getProductByIdentifier: builder.query({
      query: (identifier) => `/products/${identifier}`,
      providesTags: (_result, _error, identifier) => [{ type: 'Products', id: identifier }],
    }),
    createProduct: builder.mutation({
      query: (payload) => ({
        url: '/products',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'Products', id: 'LIST' }],
    }),
    updateProduct: builder.mutation({
      query: ({ identifier, ...payload }) => ({
        url: `/products/${identifier}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: (_result, _error, { identifier }) => [
        { type: 'Products', id: identifier },
        { type: 'Products', id: 'LIST' },
      ],
    }),
    deleteProduct: builder.mutation({
      query: (identifier) => ({
        url: `/products/${identifier}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Products', id: 'LIST' }],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdentifierQuery,
  useGetProductsQuery,
  useUpdateProductMutation,
} = productsApi;

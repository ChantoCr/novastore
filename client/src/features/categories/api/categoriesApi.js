import { baseApi } from '../../../services/baseApi.js';

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => '/categories',
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((category) => ({ type: 'Categories', id: category.id })),
              { type: 'Categories', id: 'PUBLIC-LIST' },
            ]
          : [{ type: 'Categories', id: 'PUBLIC-LIST' }],
    }),
    getManagedCategories: builder.query({
      query: (params = {}) => ({
        url: '/categories/manage',
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((category) => ({ type: 'Categories', id: category.id })),
              { type: 'Categories', id: 'MANAGED-LIST' },
            ]
          : [{ type: 'Categories', id: 'MANAGED-LIST' }],
    }),
    createCategory: builder.mutation({
      query: (payload) => ({
        url: '/categories',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [
        { type: 'Categories', id: 'PUBLIC-LIST' },
        { type: 'Categories', id: 'MANAGED-LIST' },
        'Products',
        'ManagedProducts',
      ],
    }),
    updateCategory: builder.mutation({
      query: ({ identifier, ...payload }) => ({
        url: `/categories/${identifier}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: [
        { type: 'Categories', id: 'PUBLIC-LIST' },
        { type: 'Categories', id: 'MANAGED-LIST' },
        'Products',
        'ManagedProducts',
      ],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useGetManagedCategoriesQuery,
  useUpdateCategoryMutation,
} = categoriesApi;

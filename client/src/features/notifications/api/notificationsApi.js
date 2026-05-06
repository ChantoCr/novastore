import { baseApi } from '../../../services/baseApi.js';

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: (params = {}) => ({
        url: '/notifications',
        params,
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map((notification) => ({ type: 'Notifications', id: notification.id })),
              { type: 'Notifications', id: 'LIST' },
            ]
          : [{ type: 'Notifications', id: 'LIST' }],
    }),
    markNotificationAsRead: builder.mutation({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, notificationId) => [
        { type: 'Notifications', id: notificationId },
        { type: 'Notifications', id: 'LIST' },
      ],
    }),
    markAllNotificationsAsRead: builder.mutation({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PATCH',
      }),
      invalidatesTags: [{ type: 'Notifications', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
} = notificationsApi;

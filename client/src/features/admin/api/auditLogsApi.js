import { baseApi } from '../../../services/baseApi.js';

export const auditLogsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAuditLogs: builder.query({
      query: (params = {}) => ({
        url: '/audit-logs',
        params,
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map((log) => ({ type: 'AuditLogs', id: log.id })),
              { type: 'AuditLogs', id: 'LIST' },
            ]
          : [{ type: 'AuditLogs', id: 'LIST' }],
    }),
  }),
});

export const { useGetAuditLogsQuery } = auditLogsApi;

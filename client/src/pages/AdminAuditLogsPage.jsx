import { useMemo, useState } from 'react';

import { useGetAuditLogsQuery } from '../features/admin/api/auditLogsApi.js';

function formatDate(value) {
  if (!value) {
    return 'Unknown date';
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function formatJsonPreview(value) {
  if (!value) {
    return '—';
  }

  const formatted = JSON.stringify(value, null, 2);

  return formatted.length > 240 ? `${formatted.slice(0, 240)}...` : formatted;
}

function AdminAuditLogsPage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    action: 'all',
    entityType: 'all',
    search: '',
  });

  const queryParams = useMemo(
    () => ({
      ...filters,
      search: filters.search || undefined,
    }),
    [filters],
  );

  const { data, isLoading, isError, error } = useGetAuditLogsQuery(queryParams);
  const logs = data?.data?.items || [];
  const pagination = data?.data?.pagination;

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-violet-300">Admin audit logs</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Trace important admin actions</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          This read-only view exposes product and order administration history so reviewers can inspect
          who changed what and when.
        </p>
      </div>

      <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-6 md:grid-cols-2 xl:grid-cols-4">
        <label className="text-sm text-slate-200 xl:col-span-2">
          Search admin, action, entity, or ID
          <input
            type="text"
            value={filters.search}
            onChange={(event) =>
              setFilters((current) => ({ ...current, page: 1, search: event.target.value }))
            }
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            placeholder="e.g. admin, product_status_changed, order"
          />
        </label>

        <label className="text-sm text-slate-200">
          Action
          <input
            type="text"
            value={filters.action === 'all' ? '' : filters.action}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                page: 1,
                action: event.target.value.trim() || 'all',
              }))
            }
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            placeholder="all"
          />
        </label>

        <label className="text-sm text-slate-200">
          Entity type
          <select
            value={filters.entityType}
            onChange={(event) =>
              setFilters((current) => ({ ...current, page: 1, entityType: event.target.value }))
            }
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
          >
            <option value="all">All entities</option>
            <option value="product">Product</option>
            <option value="order">Order</option>
            <option value="coupon">Coupon</option>
          </select>
        </label>
      </div>

      {isLoading ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
          Loading audit logs...
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-6 text-sm text-rose-200">
          {error?.data?.message || 'Could not load audit logs.'}
        </div>
      ) : null}

      {!isLoading && !isError ? (
        <div className="space-y-4">
          {logs.length ? (
            logs.map((log) => (
              <article key={log.id} className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-violet-300">Audit #{log.id}</p>
                    <h3 className="mt-2 text-lg font-semibold text-white">{log.action}</h3>
                    <p className="mt-2 text-sm text-slate-400">{formatDate(log.createdAt)}</p>
                  </div>

                  <div className="text-right text-sm text-slate-300">
                    <p>
                      Entity: <span className="font-medium text-white">{log.entityType}</span>
                      {log.entityId ? ` #${log.entityId}` : ''}
                    </p>
                    <p>
                      Admin:{' '}
                      <span className="font-medium text-white">
                        {log.adminUser?.name || 'Unknown'}
                        {log.adminUser?.email ? ` · ${log.adminUser.email}` : ''}
                      </span>
                    </p>
                    {log.ipAddress ? (
                      <p>
                        IP: <span className="font-medium text-white">{log.ipAddress}</span>
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-5 grid gap-4 xl:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Previous value</p>
                    <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words text-xs leading-6 text-slate-300">
                      {formatJsonPreview(log.oldValue)}
                    </pre>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">New value</p>
                    <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words text-xs leading-6 text-slate-300">
                      {formatJsonPreview(log.newValue)}
                    </pre>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
              No audit logs match the current filters.
            </div>
          )}
        </div>
      ) : null}

      {pagination ? (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-slate-300">
          <span>
            Page {pagination.page} of {pagination.totalPages} · {pagination.totalItems}{' '}
            {pagination.totalItems === 1 ? 'audit entry' : 'audit entries'}
          </span>
          <div className="flex gap-3">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => setFilters((current) => ({ ...current, page: current.page - 1 }))}
              className="rounded-full border border-white/10 px-4 py-2 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))}
              className="rounded-full border border-white/10 px-4 py-2 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default AdminAuditLogsPage;

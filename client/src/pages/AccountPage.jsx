import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import OrderDetailPanel from '../features/orders/components/OrderDetailPanel.jsx';
import OrderHistoryList from '../features/orders/components/OrderHistoryList.jsx';
import { useGetMyOrderByIdQuery, useGetMyOrdersQuery } from '../features/orders/api/ordersApi.js';
import { formatCurrency } from '../utils/currency.js';

function AccountPage() {
  const user = useSelector((state) => state.auth.user);
  const role = useSelector((state) => state.auth.role);
  const [searchParams, setSearchParams] = useSearchParams();
  const preselectedOrderId = Number(searchParams.get('orderId')) || null;
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState(preselectedOrderId);

  const queryParams = useMemo(
    () => ({
      page,
      limit: 6,
      status: statusFilter,
    }),
    [page, statusFilter],
  );

  const { data, isLoading, isError, error } = useGetMyOrdersQuery(queryParams);
  const orders = useMemo(() => data?.data?.items || [], [data]);
  const pagination = data?.data?.pagination;
  const summary = data?.data?.summary;

  useEffect(() => {
    if (preselectedOrderId && preselectedOrderId !== selectedOrderId) {
      setSelectedOrderId(preselectedOrderId);
    }
  }, [preselectedOrderId, selectedOrderId]);

  useEffect(() => {
    if (!orders.length) {
      if (!selectedOrderId) {
        setSelectedOrderId(null);
      }
      return;
    }

    if (!selectedOrderId) {
      setSelectedOrderId(orders[0].id);
    }
  }, [orders, selectedOrderId]);

  const {
    data: selectedOrderResponse,
    isLoading: isOrderLoading,
    isFetching: isOrderFetching,
  } = useGetMyOrderByIdQuery(selectedOrderId, {
    skip: !selectedOrderId,
  });

  const selectedOrder = selectedOrderId ? selectedOrderResponse?.data : null;

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-violet-300">Account</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Profile and order history</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          This area now surfaces the authenticated shopper profile together with the order records
          created by the checkout simulation flow. Order access is enforced on the backend by the
          authenticated owner.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Name</p>
          <p className="mt-3 text-lg font-semibold text-white">{user?.name || 'Unknown user'}</p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Email</p>
          <p className="mt-3 text-lg font-semibold text-white">{user?.email || 'Unavailable'}</p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Primary role</p>
          <p className="mt-3 text-lg font-semibold capitalize text-white">{role || 'guest'}</p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Access level</p>
          <p className="mt-3 text-lg font-semibold text-white">
            {role === 'admin' ? 'Admin dashboard enabled' : 'Shopper account'}
          </p>
        </article>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Total orders</p>
          <p className="mt-3 text-2xl font-semibold text-white">{summary?.totalOrders ?? '—'}</p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Approved orders</p>
          <p className="mt-3 text-2xl font-semibold text-white">{summary?.approvedOrders ?? '—'}</p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Pending orders</p>
          <p className="mt-3 text-2xl font-semibold text-white">{summary?.pendingOrders ?? '—'}</p>
        </article>

        <article className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-200">Total approved spend</p>
          <p className="mt-3 text-2xl font-semibold text-white">
            {summary ? formatCurrency(summary.totalSpent) : '—'}
          </p>
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-violet-300">Orders</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">Order history</h3>
              </div>

              <label className="text-sm text-slate-200">
                Status filter
                <select
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(event.target.value);
                    setPage(1);
                  }}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
                >
                  <option value="all">All statuses</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </label>
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
              Loading orders...
            </div>
          ) : null}

          {isError ? (
            <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-6 text-sm text-rose-200">
              {error?.data?.message || 'Could not load your orders.'}
            </div>
          ) : null}

          {!isLoading && !isError ? (
            <OrderHistoryList
              orders={orders}
              selectedOrderId={selectedOrderId}
              onSelectOrder={(orderId) => {
                setSelectedOrderId(orderId);
                setSearchParams((current) => {
                  const next = new URLSearchParams(current);
                  next.set('orderId', String(orderId));
                  return next;
                });
              }}
            />
          ) : null}

          {pagination ? (
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-slate-300">
              <span>
                Page {pagination.page} of {pagination.totalPages} · {pagination.totalItems} order
                {pagination.totalItems === 1 ? '' : 's'}
              </span>
              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() => setPage((current) => current - 1)}
                  className="rounded-full border border-white/10 px-4 py-2 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPage((current) => current + 1)}
                  className="rounded-full border border-white/10 px-4 py-2 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <OrderDetailPanel order={selectedOrder} isLoading={isOrderLoading || isOrderFetching} />
      </div>
    </section>
  );
}

export default AccountPage;

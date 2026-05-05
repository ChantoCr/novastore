import { useEffect, useMemo, useState } from 'react';

import AdminOrderStatusForm from '../features/admin/components/AdminOrderStatusForm.jsx';
import OrderDetailPanel from '../features/orders/components/OrderDetailPanel.jsx';
import OrderHistoryList from '../features/orders/components/OrderHistoryList.jsx';
import {
  useGetAdminOrderByIdQuery,
  useGetAdminOrdersQuery,
  useUpdateAdminOrderStatusMutation,
} from '../features/orders/api/ordersApi.js';
import { formatCurrency } from '../utils/currency.js';

function AdminOrdersPage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 8,
    status: 'all',
    paymentStatus: 'all',
    search: '',
  });
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const queryParams = useMemo(
    () => ({
      ...filters,
      search: filters.search || undefined,
    }),
    [filters],
  );

  const { data, isLoading, isError, error } = useGetAdminOrdersQuery(queryParams);
  const [updateAdminOrderStatus, { isLoading: isUpdatingStatus }] = useUpdateAdminOrderStatusMutation();
  const orders = useMemo(() => data?.data?.items || [], [data]);
  const pagination = data?.data?.pagination;
  const summary = data?.data?.summary;

  useEffect(() => {
    if (!orders.length) {
      setSelectedOrderId(null);
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
  } = useGetAdminOrderByIdQuery(selectedOrderId, {
    skip: !selectedOrderId,
  });

  const selectedOrder = selectedOrderId ? selectedOrderResponse?.data : null;

  async function handleStatusSubmit(values) {
    if (!selectedOrderId) {
      return;
    }

    setFeedback(null);

    try {
      const response = await updateAdminOrderStatus({
        orderId: selectedOrderId,
        status: values.status,
        note: values.note || undefined,
      }).unwrap();

      setFeedback({
        type: 'success',
        message: `Order #${response.data.id} moved to ${response.data.status}. The change was recorded in audit logs.`,
      });
    } catch (mutationError) {
      setFeedback({
        type: 'error',
        message: mutationError?.data?.message || 'Could not update the order status.',
      });
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-violet-300">Admin orders</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Review customer order history</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          Admins can inspect any order, including customer identity, purchased items, per-item prices,
          totals, coupon usage, and payment simulation metadata.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Total orders</p>
          <p className="mt-3 text-2xl font-semibold text-white">{summary?.totalOrders ?? '—'}</p>
        </article>
        <article className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-200">Approved revenue</p>
          <p className="mt-3 text-2xl font-semibold text-white">
            {summary ? formatCurrency(summary.approvedRevenue) : '—'}
          </p>
        </article>
        <article className="rounded-3xl border border-amber-400/20 bg-amber-500/10 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-200">Pending orders</p>
          <p className="mt-3 text-2xl font-semibold text-white">{summary?.pendingOrders ?? '—'}</p>
        </article>
        <article className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-rose-200">Rejected payments</p>
          <p className="mt-3 text-2xl font-semibold text-white">{summary?.rejectedOrders ?? '—'}</p>
        </article>
      </div>

      <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-6 md:grid-cols-2 xl:grid-cols-4">
        <label className="text-sm text-slate-200 xl:col-span-2">
          Search by order ID, customer name, or email
          <input
            type="text"
            value={filters.search}
            onChange={(event) =>
              setFilters((current) => ({ ...current, page: 1, search: event.target.value }))
            }
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            placeholder="e.g. 12, NOVA User, user@novastore.dev"
          />
        </label>

        <label className="text-sm text-slate-200">
          Order status
          <select
            value={filters.status}
            onChange={(event) =>
              setFilters((current) => ({ ...current, page: 1, status: event.target.value }))
            }
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

        <label className="text-sm text-slate-200">
          Payment status
          <select
            value={filters.paymentStatus}
            onChange={(event) =>
              setFilters((current) => ({ ...current, page: 1, paymentStatus: event.target.value }))
            }
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
          >
            <option value="all">All payments</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="refunded">Refunded</option>
          </select>
        </label>
      </div>

      {feedback ? (
        <div
          className={`rounded-2xl px-4 py-3 text-sm ${
            feedback.type === 'success'
              ? 'border border-emerald-400/20 bg-emerald-500/10 text-emerald-200'
              : 'border border-rose-400/20 bg-rose-500/10 text-rose-200'
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          {isLoading ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
              Loading admin orders...
            </div>
          ) : null}

          {isError ? (
            <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-6 text-sm text-rose-200">
              {error?.data?.message || 'Could not load admin orders.'}
            </div>
          ) : null}

          {!isLoading && !isError ? (
            <OrderHistoryList
              orders={orders}
              selectedOrderId={selectedOrderId}
              onSelectOrder={setSelectedOrderId}
              emptyMessage="No orders match the current admin filters yet."
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
        </div>

        <div className="space-y-6">
          <AdminOrderStatusForm
            order={selectedOrder}
            isSubmitting={isUpdatingStatus}
            onSubmit={handleStatusSubmit}
          />
          <OrderDetailPanel order={selectedOrder} isLoading={isOrderLoading || isOrderFetching} />
        </div>
      </div>
    </section>
  );
}

export default AdminOrdersPage;

import { useMemo, useState } from 'react';

import AdminCouponForm from '../features/admin/components/AdminCouponForm.jsx';
import AdminCouponsTable from '../features/admin/components/AdminCouponsTable.jsx';
import {
  useCreateCouponMutation,
  useGetCouponsQuery,
  useUpdateCouponMutation,
} from '../features/coupons/api/couponsApi.js';

const defaultFilters = {
  page: 1,
  limit: 10,
  search: '',
  status: 'all',
  discountType: 'all',
};

const emptyCoupons = [];

function AdminCouponsPage() {
  const [filters, setFilters] = useState(defaultFilters);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [formResetKey, setFormResetKey] = useState(0);

  const queryParams = useMemo(
    () => ({
      ...filters,
      search: filters.search || undefined,
    }),
    [filters],
  );

  const { data, isLoading, isError, error } = useGetCouponsQuery(queryParams);
  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();

  const coupons = data?.data?.items || emptyCoupons;
  const pagination = data?.data?.pagination;
  const isSaving = isCreating || isUpdating;

  const summary = useMemo(() => {
    const activeCount = coupons.filter((coupon) => coupon.isActive).length;
    const inactiveCount = coupons.length - activeCount;

    return {
      visibleOnPage: coupons.length,
      activeCount,
      inactiveCount,
      exhaustedCount: coupons.filter(
        (coupon) => coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit,
      ).length,
    };
  }, [coupons]);

  async function handleCreateOrUpdate(values) {
    setFeedback(null);

    try {
      if (selectedCoupon) {
        await updateCoupon({ couponId: selectedCoupon.id, ...values }).unwrap();
        setFeedback({
          type: 'success',
          message: `Coupon ${values.code} updated successfully. The change was recorded in audit logs.`,
        });
      } else {
        await createCoupon(values).unwrap();
        setFeedback({
          type: 'success',
          message: `Coupon ${values.code} created successfully and is ready for checkout validation.`,
        });
        setFormResetKey((current) => current + 1);
      }

      setSelectedCoupon(null);
    } catch (mutationError) {
      setFeedback({
        type: 'error',
        message: mutationError?.data?.message || 'Coupon save failed. Review the form and try again.',
      });
    }
  }

  async function handleToggleStatus(coupon) {
    setFeedback(null);

    try {
      await updateCoupon({ couponId: coupon.id, isActive: !coupon.isActive }).unwrap();
      setFeedback({
        type: 'success',
        message: `${coupon.code} is now ${coupon.isActive ? 'inactive' : 'active'}.`,
      });
    } catch (mutationError) {
      setFeedback({
        type: 'error',
        message: mutationError?.data?.message || 'Could not update coupon status.',
      });
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-violet-300">Admin coupons</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Manage discounts and checkout rules</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          Coupon administration now lives in its own protected workflow so discount behavior stays
          explicit, auditable, and ready for more advanced checkout scenarios.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Visible on page</p>
          <p className="mt-3 text-2xl font-semibold text-white">{summary.visibleOnPage}</p>
        </article>
        <article className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-200">Active coupons</p>
          <p className="mt-3 text-2xl font-semibold text-white">{summary.activeCount}</p>
        </article>
        <article className="rounded-3xl border border-amber-400/20 bg-amber-500/10 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-200">Inactive coupons</p>
          <p className="mt-3 text-2xl font-semibold text-white">{summary.inactiveCount}</p>
        </article>
        <article className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-rose-200">Usage exhausted</p>
          <p className="mt-3 text-2xl font-semibold text-white">{summary.exhaustedCount}</p>
        </article>
      </div>

      <AdminCouponForm
        key={selectedCoupon?.id || `create-${formResetKey}`}
        coupon={selectedCoupon}
        isSubmitting={isSaving}
        onCancel={() => setSelectedCoupon(null)}
        onSubmit={handleCreateOrUpdate}
      />

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

      <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-6 md:grid-cols-2 xl:grid-cols-4">
        <label className="text-sm text-slate-200 xl:col-span-2">
          Search by code
          <input
            type="text"
            value={filters.search}
            onChange={(event) =>
              setFilters((current) => ({ ...current, page: 1, search: event.target.value }))
            }
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            placeholder="e.g. NOVA10"
          />
        </label>

        <label className="text-sm text-slate-200">
          Status
          <select
            value={filters.status}
            onChange={(event) =>
              setFilters((current) => ({ ...current, page: 1, status: event.target.value }))
            }
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>

        <label className="text-sm text-slate-200">
          Discount type
          <select
            value={filters.discountType}
            onChange={(event) =>
              setFilters((current) => ({ ...current, page: 1, discountType: event.target.value }))
            }
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
          >
            <option value="all">All types</option>
            <option value="fixed">Fixed</option>
            <option value="percentage">Percentage</option>
          </select>
        </label>
      </div>

      {isLoading ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
          Loading coupons...
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-6 text-sm text-rose-200">
          {error?.data?.message || 'Could not load coupons.'}
        </div>
      ) : null}

      {!isLoading && !isError ? (
        <AdminCouponsTable
          coupons={coupons}
          isToggling={isUpdating}
          onEdit={setSelectedCoupon}
          onToggleStatus={handleToggleStatus}
        />
      ) : null}

      {pagination ? (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-slate-300">
          <span>
            Page {pagination.page} of {pagination.totalPages} · {pagination.totalItems} coupon
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
    </section>
  );
}

export default AdminCouponsPage;

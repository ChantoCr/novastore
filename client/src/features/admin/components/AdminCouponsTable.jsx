import { formatCurrency } from '../../../utils/currency.js';

function formatDate(value) {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function formatDiscount(coupon) {
  if (coupon.discountType === 'percentage') {
    return `${coupon.discountValue}%`;
  }

  return formatCurrency(coupon.discountValue);
}

function AdminCouponsTable({ coupons = [], isToggling = false, onEdit, onToggleStatus }) {
  if (!coupons.length) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
        No coupons match the current admin filters yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-200">
          <thead className="bg-slate-950/70 text-xs uppercase tracking-[0.25em] text-slate-400">
            <tr>
              <th className="px-4 py-4 font-medium">Code</th>
              <th className="px-4 py-4 font-medium">Discount</th>
              <th className="px-4 py-4 font-medium">Minimum purchase</th>
              <th className="px-4 py-4 font-medium">Usage</th>
              <th className="px-4 py-4 font-medium">Schedule</th>
              <th className="px-4 py-4 font-medium">Status</th>
              <th className="px-4 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-slate-950/40">
            {coupons.map((coupon) => (
              <tr key={coupon.id}>
                <td className="px-4 py-4">
                  <p className="font-semibold text-white">{coupon.code}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                    {coupon.discountType}
                  </p>
                </td>
                <td className="px-4 py-4 text-slate-300">{formatDiscount(coupon)}</td>
                <td className="px-4 py-4 text-slate-300">{formatCurrency(coupon.minPurchaseAmount)}</td>
                <td className="px-4 py-4 text-slate-300">
                  {coupon.usedCount}
                  {coupon.usageLimit !== null ? ` / ${coupon.usageLimit}` : ' / unlimited'}
                </td>
                <td className="px-4 py-4 text-xs leading-6 text-slate-300">
                  <div>Starts: {formatDate(coupon.startsAt)}</div>
                  <div>Expires: {formatDate(coupon.expiresAt)}</div>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      coupon.isActive
                        ? 'border border-emerald-400/20 bg-emerald-500/10 text-emerald-200'
                        : 'border border-amber-400/20 bg-amber-500/10 text-amber-200'
                    }`}
                  >
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(coupon)}
                      className="rounded-full border border-white/10 px-3 py-2 text-xs text-slate-200 transition hover:border-violet-400/30 hover:text-white"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={isToggling}
                      onClick={() => onToggleStatus(coupon)}
                      className="rounded-full border border-white/10 px-3 py-2 text-xs text-slate-200 transition hover:border-violet-400/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {coupon.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminCouponsTable;

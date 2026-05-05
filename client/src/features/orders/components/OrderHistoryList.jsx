import { formatCurrency } from '../../../utils/currency.js';

function formatOrderDate(value) {
  if (!value) {
    return 'Unknown date';
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function StatusBadge({ children, tone = 'default' }) {
  const toneClasses = {
    default: 'border-white/10 bg-white/5 text-slate-200',
    success: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-100',
    warning: 'border-amber-400/20 bg-amber-500/10 text-amber-100',
    danger: 'border-rose-400/20 bg-rose-500/10 text-rose-100',
  };

  return (
    <span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] ${toneClasses[tone]}`}>
      {children}
    </span>
  );
}

function getPaymentTone(paymentStatus) {
  if (paymentStatus === 'approved') {
    return 'success';
  }

  if (paymentStatus === 'pending') {
    return 'warning';
  }

  if (paymentStatus === 'rejected') {
    return 'danger';
  }

  return 'default';
}

function OrderHistoryList({ orders, selectedOrderId, onSelectOrder, emptyMessage = null }) {
  if (!orders.length) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm leading-6 text-slate-300">
        {emptyMessage ||
          'No orders match the current filter yet. Complete the checkout simulation to create your first order history entry.'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const isSelected = order.id === selectedOrderId;

        return (
          <button
            key={order.id}
            type="button"
            onClick={() => onSelectOrder(order.id)}
            className={`w-full rounded-3xl border p-5 text-left transition ${
              isSelected
                ? 'border-violet-400/40 bg-violet-500/10'
                : 'border-white/10 bg-white/5 hover:border-violet-400/20'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-violet-300">Order #{order.id}</p>
                <h3 className="mt-2 text-lg font-semibold text-white">{formatOrderDate(order.createdAt)}</h3>
                <p className="mt-2 text-sm text-slate-400">
                  {order.totalQuantity} item{order.totalQuantity === 1 ? '' : 's'} · {order.itemCount} line
                  {order.itemCount === 1 ? '' : 's'}
                </p>
                {order.customer?.name || order.customer?.email ? (
                  <p className="mt-2 text-sm text-slate-300">
                    Customer: {order.customer?.name || 'Unknown'}
                    {order.customer?.email ? ` · ${order.customer.email}` : ''}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-2">
                <StatusBadge>{order.status}</StatusBadge>
                <StatusBadge tone={getPaymentTone(order.paymentStatus)}>{order.paymentStatus}</StatusBadge>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
              <span>Total</span>
              <span className="text-lg font-semibold text-white">{formatCurrency(order.total)}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default OrderHistoryList;

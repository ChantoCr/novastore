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

function AddressBlock({ title, address }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{title}</p>
      {address ? (
        <div className="mt-3 space-y-1 leading-6">
          <p className="font-medium text-white">{address.fullName}</p>
          <p>{address.line1}</p>
          {address.line2 ? <p>{address.line2}</p> : null}
          <p>
            {address.city}
            {address.state ? `, ${address.state}` : ''}
            {address.postalCode ? ` ${address.postalCode}` : ''}
          </p>
          <p>{address.country}</p>
          {address.phone ? <p>{address.phone}</p> : null}
        </div>
      ) : (
        <p className="mt-3">No address data available.</p>
      )}
    </div>
  );
}

function OrderDetailPanel({ order, isLoading }) {
  if (isLoading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm leading-6 text-slate-300">
        Select an order to inspect its items, addresses, totals, and payment simulation result.
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-3xl border border-white/10 bg-slate-950/70 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-violet-300">Order detail</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Order #{order.id}</h3>
          <p className="mt-2 text-sm text-slate-400">Created {formatOrderDate(order.createdAt)}</p>
        </div>

        <div className="text-right text-sm text-slate-300">
          <p>Status: <span className="font-medium capitalize text-white">{order.status}</span></p>
          <p>
            Payment: <span className="font-medium capitalize text-white">{order.paymentStatus}</span>
          </p>
          {order.payment?.providerReference ? (
            <p>Reference: <span className="font-medium text-white">{order.payment.providerReference}</span></p>
          ) : null}
        </div>
      </div>

      {order.customer ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Customer</p>
          <div className="mt-3 space-y-1 leading-6">
            <p className="font-medium text-white">{order.customer.name || 'Unknown customer'}</p>
            {order.customer.email ? <p>{order.customer.email}</p> : null}
            {order.customer.id ? <p>Customer ID: {order.customer.id}</p> : null}
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <AddressBlock title="Shipping" address={order.shippingAddress} />
        <AddressBlock title="Billing" address={order.billingAddress} />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Items</p>
        <div className="mt-4 space-y-3">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300"
            >
              <div>
                <p className="font-medium text-white">{item.productName}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">{item.productSku}</p>
              </div>
              <div className="text-right">
                <p>
                  {item.quantity} × {formatCurrency(item.unitPrice)}
                </p>
                <p className="font-medium text-white">{formatCurrency(item.lineTotal)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Subtotal</p>
          <p className="mt-3 text-lg font-semibold text-white">{formatCurrency(order.subtotal)}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Discount</p>
          <p className="mt-3 text-lg font-semibold text-white">{formatCurrency(order.discountTotal)}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Tax</p>
          <p className="mt-3 text-lg font-semibold text-white">{formatCurrency(order.taxTotal)}</p>
        </div>
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-200">Final total</p>
          <p className="mt-3 text-lg font-semibold text-white">{formatCurrency(order.total)}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
        <p>
          Coupon: <span className="font-medium text-white">{order.couponCode || 'No coupon applied'}</span>
        </p>
        <p>
          Card ending: <span className="font-medium text-white">{order.payment?.cardLast4 || 'N/A'}</span>
        </p>
        {order.notes ? (
          <p>
            Notes: <span className="text-white">{order.notes}</span>
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default OrderDetailPanel;

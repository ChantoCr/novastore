import { Link } from 'react-router-dom';

import { formatCurrency } from '../../../utils/currency.js';

function CartSummaryCard({ itemCount, subtotal, checkoutHref = '/checkout', isCheckoutDisabled = false }) {
  return (
    <aside className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
      <p className="text-xs uppercase tracking-[0.35em] text-violet-300">Cart summary</p>
      <div className="mt-6 space-y-4 text-sm text-slate-300">
        <div className="flex items-center justify-between gap-3">
          <span>Items</span>
          <span>{itemCount}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-6 text-slate-400">
          Taxes, coupon validation, payment simulation, and stock enforcement are calculated on the
          backend during checkout.
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <Link
          to={checkoutHref}
          aria-disabled={isCheckoutDisabled}
          className={`rounded-full px-5 py-3 text-center text-sm font-medium transition ${
            isCheckoutDisabled
              ? 'pointer-events-none bg-white/10 text-slate-400'
              : 'bg-violet-500 text-white hover:bg-violet-400'
          }`}
        >
          Proceed to checkout
        </Link>
        <Link
          to="/products"
          className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-center text-sm font-medium text-slate-100 transition hover:border-violet-400/30"
        >
          Continue shopping
        </Link>
      </div>
    </aside>
  );
}

export default CartSummaryCard;

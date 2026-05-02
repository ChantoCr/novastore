import { formatCurrency } from '../../../utils/currency.js';

function CartItemCard({ item, onDecrease, onIncrease, onRemove }) {
  return (
    <article className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 lg:grid-cols-[120px_1fr_auto] lg:items-center">
      <div className="overflow-hidden rounded-2xl bg-slate-950">
        {item.primaryImageUrl ? (
          <img src={item.primaryImageUrl} alt={item.name} className="h-28 w-full object-cover" />
        ) : (
          <div className="flex h-28 items-center justify-center text-sm text-slate-400">
            Product image
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-violet-300">{item.categoryName}</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{item.name}</h3>
          <p className="mt-1 text-sm text-slate-400">SKU: {item.sku}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
          <span>{formatCurrency(item.price)} each</span>
          <span>•</span>
          <span>{item.stock} available</span>
          <span>•</span>
          <span className="text-white">Line total: {formatCurrency(item.price * item.quantity)}</span>
        </div>
      </div>

      <div className="flex flex-col items-start gap-3 lg:items-end">
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-slate-950/70 px-3 py-2">
          <button
            type="button"
            onClick={onDecrease}
            className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-200 transition hover:border-violet-400/30"
          >
            −
          </button>
          <span className="min-w-8 text-center text-sm font-medium text-white">{item.quantity}</span>
          <button
            type="button"
            onClick={onIncrease}
            disabled={item.quantity >= item.stock}
            className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-200 transition hover:border-violet-400/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="text-sm text-rose-300 transition hover:text-rose-200"
        >
          Remove item
        </button>
      </div>
    </article>
  );
}

export default CartItemCard;

import { Link } from 'react-router-dom';

import { formatCurrency } from '../../../utils/currency.js';

function ProductCard({ product }) {
  const isLowStock = product.stock <= product.lowStockThreshold;

  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-violet-400/30">
      <div className="aspect-[4/3] bg-gradient-to-br from-slate-800 to-slate-950">
        {product.primaryImageUrl ? (
          <img
            src={product.primaryImageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            Product image placeholder
          </div>
        )}
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-violet-300">
              {product.categoryName || 'Uncategorized'}
            </p>
            <h3 className="mt-2 text-lg font-semibold text-white">{product.name}</h3>
          </div>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-200">
            {formatCurrency(product.price)}
          </span>
        </div>

        <p className="line-clamp-3 text-sm leading-6 text-slate-300">
          {product.description || 'Product description will be added in later implementation phases.'}
        </p>

        <div className="flex items-center justify-between gap-4 text-sm">
          <span className={isLowStock ? 'text-amber-300' : 'text-emerald-300'}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
          <Link
            to={`/products/${product.slug || product.id}`}
            className="rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-violet-200 transition hover:bg-violet-500/20"
          >
            View product
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;

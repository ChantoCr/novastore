import { formatCurrency } from '../../../utils/currency.js';

function AdminProductsTable({
  onAdjustStock,
  onEdit,
  onToggleStatus,
  products = [],
  isToggling = false,
}) {
  if (!products.length) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-slate-300">
        No products matched the current filters.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-200">
          <thead className="bg-slate-950/80 text-xs uppercase tracking-[0.25em] text-slate-400">
            <tr>
              <th className="px-4 py-4">Product</th>
              <th className="px-4 py-4">Category</th>
              <th className="px-4 py-4">Price</th>
              <th className="px-4 py-4">Stock</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((product) => (
              <tr key={product.id} className="align-top">
                <td className="px-4 py-4">
                  <div className="flex items-start gap-3">
                    <div className="h-16 w-16 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80">
                      {product.primaryImageUrl ? (
                        <img
                          src={product.primaryImageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-500">
                          No image
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-white">{product.name}</p>
                      <p className="mt-1 text-xs text-slate-400">{product.slug}</p>
                      <p className="mt-1 text-xs text-slate-500">SKU: {product.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-slate-300">{product.categoryName || 'Uncategorized'}</td>
                <td className="px-4 py-4 text-slate-300">{formatCurrency(product.price)}</td>
                <td className="px-4 py-4 text-slate-300">
                  <div>
                    <span>{product.stock}</span>
                    {product.stock <= product.lowStockThreshold ? (
                      <span className="ml-2 rounded-full border border-amber-400/20 bg-amber-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-amber-300">
                        Low stock
                      </span>
                    ) : null}
                    <p className="mt-1 text-xs text-slate-500">Threshold: {product.lowStockThreshold}</p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      product.isActive
                        ? 'border border-emerald-400/20 bg-emerald-500/10 text-emerald-200'
                        : 'border border-slate-400/20 bg-slate-500/10 text-slate-300'
                    }`}
                  >
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(product)}
                      className="rounded-full border border-white/10 px-3 py-2 text-xs text-slate-200 transition hover:border-violet-400/30 hover:text-white"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onAdjustStock(product)}
                      className="rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-200 transition hover:bg-amber-500/20"
                    >
                      Adjust stock
                    </button>
                    <button
                      type="button"
                      disabled={isToggling}
                      onClick={() => onToggleStatus(product)}
                      className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-2 text-xs text-violet-200 transition hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {product.isActive ? 'Deactivate' : 'Activate'}
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

export default AdminProductsTable;

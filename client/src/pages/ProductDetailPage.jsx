import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import { addItem } from '../features/cart/cartSlice.js';
import { useGetProductByIdentifierQuery } from '../features/products/api/productsApi.js';
import { addToast } from '../features/ui/uiSlice.js';
import WishlistToggleButton from '../features/wishlist/components/WishlistToggleButton.jsx';
import { formatCurrency } from '../utils/currency.js';

function ProductDetailPage() {
  const dispatch = useDispatch();
  const { productIdOrSlug } = useParams();
  const { data, isLoading, isError, error } = useGetProductByIdentifierQuery(productIdOrSlug);
  const product = data?.data;
  const [quantity, setQuantity] = useState(1);

  function handleAddToCart() {
    if (!product) {
      return;
    }

    dispatch(
      addItem({
        product,
        quantity,
      }),
    );
    dispatch(
      addToast({
        title: 'Added to cart',
        message: `${quantity} × ${product.name} added to your cart.`,
        type: 'success',
      }),
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-300">
        Loading product details...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-6 text-rose-200">
        {error?.data?.message || 'Unable to load product details.'}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-300">
        Product not found.
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <Link to="/products" className="inline-flex text-sm text-violet-300 hover:text-violet-200">
        ← Back to catalog
      </Link>

      <div className="grid gap-8 rounded-3xl border border-white/10 bg-white/5 p-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-3xl bg-slate-950">
          {product.primaryImageUrl ? (
            <img src={product.primaryImageUrl} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex min-h-[420px] items-center justify-center text-slate-400">
              Product image placeholder
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-violet-300">
              {product.categoryName || 'Uncategorized'}
            </p>
            <h2 className="mt-3 text-4xl font-semibold text-white">{product.name}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              {product.description || 'Detailed product content will be expanded in future phases.'}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
            <p className="text-sm text-slate-400">Price</p>
            <p className="mt-2 text-3xl font-semibold text-white">{formatCurrency(product.price)}</p>
            <p className="mt-2 text-sm text-slate-300">SKU: {product.sku}</p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-slate-200">
            <span className="rounded-full border border-white/10 px-4 py-2">Stock: {product.stock}</span>
            <span className="rounded-full border border-white/10 px-4 py-2">
              Status: {product.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/70 p-5">
            <div className="flex flex-wrap items-end gap-4">
              <label className="text-sm text-slate-200">
                Quantity
                <input
                  type="number"
                  min="1"
                  max={Math.max(1, product.stock)}
                  value={quantity}
                  onChange={(event) =>
                    setQuantity(
                      Math.max(1, Math.min(Number(event.target.value) || 1, Math.max(1, product.stock))),
                    )
                  }
                  className="mt-2 w-28 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
                />
              </label>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="rounded-full bg-violet-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add to cart
              </button>

              <WishlistToggleButton product={product} className="px-5 py-3 font-medium" />

              <Link
                to="/cart"
                className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-100 transition hover:border-violet-400/30"
              >
                View cart
              </Link>
            </div>

            <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-5 text-sm leading-6 text-emerald-100">
              Cart, wishlist, and checkout simulation are now available so shoppers can either save items
              for later or move directly into purchase flow testing.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetailPage;

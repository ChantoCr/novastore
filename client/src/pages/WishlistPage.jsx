import { Link } from 'react-router-dom';

import ProductCard from '../features/products/components/ProductCard.jsx';
import { useGetWishlistQuery } from '../features/wishlist/api/wishlistApi.js';

function WishlistPage() {
  const { data, isLoading, isError, error } = useGetWishlistQuery();
  const wishlistItems = data?.data?.items || [];
  const summary = data?.data?.summary;

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-violet-300">Wishlist</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Saved products for later</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          This protected view lets authenticated shoppers keep track of products they want to revisit
          without mixing them into the cart immediately.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Saved items</p>
          <p className="mt-3 text-2xl font-semibold text-white">{summary?.itemCount ?? '—'}</p>
        </article>
        <article className="rounded-3xl border border-white/10 bg-slate-950/60 p-5 md:col-span-2 xl:col-span-3">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Next step</p>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Save items here, review product details again later, then move ready items into the cart when
            you want to simulate checkout.
          </p>
        </article>
      </div>

      {isLoading ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
          Loading wishlist...
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-6 text-sm text-rose-200">
          {error?.data?.message || 'Could not load your wishlist.'}
        </div>
      ) : null}

      {!isLoading && !isError ? (
        wishlistItems.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {wishlistItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-slate-300">
            <p className="text-lg font-medium text-white">Your wishlist is empty.</p>
            <p className="mt-3 text-sm leading-6">
              Browse the catalog and save products when you want to revisit them later.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex rounded-full border border-violet-400/30 bg-violet-500/10 px-5 py-3 text-sm font-medium text-violet-100 transition hover:bg-violet-500/20"
            >
              Explore products
            </Link>
          </div>
        )
      ) : null}
    </section>
  );
}

export default WishlistPage;

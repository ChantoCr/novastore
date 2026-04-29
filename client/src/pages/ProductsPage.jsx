import { useMemo, useState } from 'react';

import ProductGrid from '../features/products/components/ProductGrid.jsx';
import { useGetProductsQuery } from '../features/products/api/productsApi.js';

const defaultFilters = {
  page: 1,
  limit: 6,
  search: '',
  sort: 'newest',
};

function ProductsPage() {
  const [filters, setFilters] = useState(defaultFilters);
  const queryParams = useMemo(
    () => ({
      ...filters,
      search: filters.search || undefined,
    }),
    [filters],
  );
  const { data, isLoading, isError, error } = useGetProductsQuery(queryParams);

  const products = data?.data?.items || [];
  const pagination = data?.data?.pagination;

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-violet-300">Catalog</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Product module skeleton</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            This page uses RTK Query against the backend products module. Search, sorting, detail pages,
            and admin write operations are scaffolded.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm text-slate-200">
            Search
            <input
              type="text"
              value={filters.search}
              onChange={(event) =>
                setFilters((current) => ({ ...current, page: 1, search: event.target.value }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
              placeholder="Search products"
            />
          </label>

          <label className="text-sm text-slate-200">
            Sort
            <select
              value={filters.sort}
              onChange={(event) =>
                setFilters((current) => ({ ...current, page: 1, sort: event.target.value }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
              <option value="name_asc">Name: A-Z</option>
              <option value="name_desc">Name: Z-A</option>
            </select>
          </label>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-300">
          Loading products...
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-6 text-rose-200">
          {error?.data?.message || 'Could not load products. Check the API and database seed data.'}
        </div>
      ) : null}

      {!isLoading && !isError ? <ProductGrid products={products} /> : null}

      {pagination ? (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-slate-300">
          <span>
            Page {pagination.page} of {pagination.totalPages} · {pagination.totalItems} total products
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

export default ProductsPage;

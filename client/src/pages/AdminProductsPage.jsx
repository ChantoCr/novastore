import { useMemo, useState } from 'react';

import AdminProductForm from '../features/admin/components/AdminProductForm.jsx';
import AdminProductImageUploadForm from '../features/admin/components/AdminProductImageUploadForm.jsx';
import AdminProductsTable from '../features/admin/components/AdminProductsTable.jsx';
import AdminStockAdjustmentForm from '../features/admin/components/AdminStockAdjustmentForm.jsx';
import { useGetManagedCategoriesQuery } from '../features/categories/api/categoriesApi.js';
import {
  useAdjustProductStockMutation,
  useCreateProductMutation,
  useGetManagedProductsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from '../features/products/api/productsApi.js';

const defaultFilters = {
  page: 1,
  limit: 10,
  search: '',
  category: '',
  sort: 'newest',
  status: 'all',
};

function AdminProductsPage() {
  const [filters, setFilters] = useState(defaultFilters);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedStockProduct, setSelectedStockProduct] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const queryParams = useMemo(
    () => ({
      ...filters,
      search: filters.search || undefined,
      category: filters.category || undefined,
    }),
    [filters],
  );

  const { data, isLoading, isError, error } = useGetManagedProductsQuery(queryParams);
  const { data: categoriesResponse } = useGetManagedCategoriesQuery();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [adjustProductStock, { isLoading: isAdjustingStock }] = useAdjustProductStockMutation();
  const [uploadProductImage, { isLoading: isUploadingImage }] = useUploadProductImageMutation();

  const products = useMemo(() => data?.data?.items || [], [data]);
  const pagination = data?.data?.pagination;
  const categories = categoriesResponse?.data || [];
  const isSaving = isCreating || isUpdating;

  const inventorySummary = useMemo(() => {
    const lowStockProducts = products.filter((product) => product.stock <= product.lowStockThreshold);
    const inactiveProducts = products.filter((product) => !product.isActive);

    return {
      visibleOnPage: products.length,
      lowStockCount: lowStockProducts.length,
      inactiveCount: inactiveProducts.length,
      zeroStockCount: products.filter((product) => product.stock === 0).length,
    };
  }, [products]);

  async function handleCreateOrUpdate(values) {
    setFeedback(null);

    try {
      if (selectedProduct) {
        await updateProduct({ identifier: selectedProduct.slug || selectedProduct.id, ...values }).unwrap();
        setFeedback({
          type: 'success',
          message: 'Product updated successfully. Audit logging is now recorded on the backend.',
        });
      } else {
        await createProduct(values).unwrap();
        setFeedback({
          type: 'success',
          message: 'Product created successfully. Initial stock and audit logging were recorded.',
        });
      }

      setSelectedProduct(null);
    } catch (mutationError) {
      setFeedback({
        type: 'error',
        message: mutationError?.data?.message || 'Product save failed. Review the form and try again.',
      });
    }
  }

  async function handleAdjustStock(values) {
    if (!selectedStockProduct) {
      return;
    }

    setFeedback(null);

    try {
      await adjustProductStock({
        identifier: selectedStockProduct.slug || selectedStockProduct.id,
        ...values,
      }).unwrap();

      setFeedback({
        type: 'success',
        message: `Stock updated for ${selectedStockProduct.name}. Movement and audit entries were recorded.`,
      });
      setSelectedStockProduct(null);
    } catch (mutationError) {
      setFeedback({
        type: 'error',
        message: mutationError?.data?.message || 'Could not apply the stock adjustment.',
      });
    }
  }

  async function handleToggleStatus(product) {
    setFeedback(null);

    try {
      await updateProduct({
        identifier: product.slug || product.id,
        isActive: !product.isActive,
      }).unwrap();

      setFeedback({
        type: 'success',
        message: `${product.name} is now ${product.isActive ? 'inactive' : 'active'}. The change was audit logged.`,
      });
    } catch (mutationError) {
      setFeedback({
        type: 'error',
        message: mutationError?.data?.message || 'Could not update product status.',
      });
    }
  }

  async function handleUploadImage(formData) {
    if (!selectedProduct) {
      return;
    }

    setFeedback(null);

    try {
      const response = await uploadProductImage({
        identifier: selectedProduct.slug || selectedProduct.id,
        formData,
      }).unwrap();

      setSelectedProduct(response.data.product);
      setFeedback({
        type: 'success',
        message: `Image uploaded for ${response.data.product.name}. Product media metadata and audit logging were recorded.`,
      });
    } catch (mutationError) {
      setFeedback({
        type: 'error',
        message: mutationError?.data?.message || 'Could not upload the product image.',
      });
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-violet-300">Admin products</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Manage catalog entries and inventory</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          This admin view now supports explicit inventory adjustments, low-stock visibility, and backend
          audit logging for product management actions.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Visible on page</p>
          <p className="mt-3 text-2xl font-semibold text-white">{inventorySummary.visibleOnPage}</p>
        </article>
        <article className="rounded-3xl border border-amber-400/20 bg-amber-500/10 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-200">Low stock products</p>
          <p className="mt-3 text-2xl font-semibold text-white">{inventorySummary.lowStockCount}</p>
        </article>
        <article className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-rose-200">Zero stock</p>
          <p className="mt-3 text-2xl font-semibold text-white">{inventorySummary.zeroStockCount}</p>
        </article>
        <article className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Inactive products</p>
          <p className="mt-3 text-2xl font-semibold text-white">{inventorySummary.inactiveCount}</p>
        </article>
      </div>

      <AdminProductForm
        categories={categories}
        isSubmitting={isSaving}
        onCancel={() => setSelectedProduct(null)}
        onSubmit={handleCreateOrUpdate}
        product={selectedProduct}
      />

      <AdminStockAdjustmentForm
        isSubmitting={isAdjustingStock}
        onCancel={() => setSelectedStockProduct(null)}
        onSubmit={handleAdjustStock}
        product={selectedStockProduct}
      />

      <AdminProductImageUploadForm
        isSubmitting={isUploadingImage}
        onSubmit={handleUploadImage}
        product={selectedProduct}
      />

      {feedback ? (
        <div
          className={`rounded-2xl px-4 py-3 text-sm ${
            feedback.type === 'success'
              ? 'border border-emerald-400/20 bg-emerald-500/10 text-emerald-200'
              : 'border border-rose-400/20 bg-rose-500/10 text-rose-200'
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

      <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-6 md:grid-cols-2 xl:grid-cols-4">
        <label className="text-sm text-slate-200">
          Search
          <input
            type="text"
            value={filters.search}
            onChange={(event) =>
              setFilters((current) => ({ ...current, page: 1, search: event.target.value }))
            }
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            placeholder="Search by name or description"
          />
        </label>

        <label className="text-sm text-slate-200">
          Category
          <select
            value={filters.category}
            onChange={(event) =>
              setFilters((current) => ({ ...current, page: 1, category: event.target.value }))
            }
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
                {category.isActive ? '' : ' (inactive)'}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-slate-200">
          Status
          <select
            value={filters.status}
            onChange={(event) =>
              setFilters((current) => ({ ...current, page: 1, status: event.target.value }))
            }
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
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

      {isLoading ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-300">
          Loading managed products...
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-6 text-rose-200">
          {error?.data?.message || 'Could not load admin products.'}
        </div>
      ) : null}

      {!isLoading && !isError ? (
        <AdminProductsTable
          products={products}
          onAdjustStock={(product) => {
            setSelectedStockProduct(product);
            setSelectedProduct(null);
          }}
          onEdit={(product) => {
            setSelectedProduct(product);
            setSelectedStockProduct(null);
          }}
          onToggleStatus={handleToggleStatus}
          isToggling={isUpdating}
        />
      ) : null}

      {pagination ? (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-slate-300">
          <span>
            Page {pagination.page} of {pagination.totalPages} · {pagination.totalItems} managed products
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

export default AdminProductsPage;

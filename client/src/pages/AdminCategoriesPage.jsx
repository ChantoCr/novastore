import { useMemo, useState } from 'react';

import AdminCategoryForm from '../features/admin/components/AdminCategoryForm.jsx';
import AdminCategoriesTable from '../features/admin/components/AdminCategoriesTable.jsx';
import {
  useCreateCategoryMutation,
  useGetManagedCategoriesQuery,
  useUpdateCategoryMutation,
} from '../features/categories/api/categoriesApi.js';

const defaultFilters = {
  search: '',
  status: 'all',
};

const emptyCategories = [];

function AdminCategoriesPage() {
  const [filters, setFilters] = useState(defaultFilters);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [formResetKey, setFormResetKey] = useState(0);

  const queryParams = useMemo(
    () => ({
      ...filters,
      search: filters.search || undefined,
    }),
    [filters],
  );

  const { data, isLoading, isError, error } = useGetManagedCategoriesQuery(queryParams);
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

  const categories = data?.data || emptyCategories;
  const isSaving = isCreating || isUpdating;

  const categorySummary = useMemo(() => {
    const activeCount = categories.filter((category) => category.isActive).length;
    const inactiveCount = categories.length - activeCount;
    const assignedProducts = categories.reduce(
      (total, category) => total + (category.productCount ?? 0),
      0,
    );

    return {
      total: categories.length,
      activeCount,
      inactiveCount,
      assignedProducts,
    };
  }, [categories]);

  async function handleCreateOrUpdate(values) {
    setFeedback(null);

    try {
      if (selectedCategory) {
        await updateCategory({ identifier: selectedCategory.slug || selectedCategory.id, ...values }).unwrap();
        setFeedback({
          type: 'success',
          message: 'Category updated successfully. The change is now audit logged on the backend.',
        });
      } else {
        await createCategory(values).unwrap();
        setFeedback({
          type: 'success',
          message: 'Category created successfully. It is now available for admin catalog workflows.',
        });
        setFormResetKey((current) => current + 1);
      }

      setSelectedCategory(null);
    } catch (mutationError) {
      setFeedback({
        type: 'error',
        message: mutationError?.data?.message || 'Category save failed. Review the form and try again.',
      });
    }
  }

  async function handleToggleStatus(category) {
    setFeedback(null);

    try {
      await updateCategory({
        identifier: category.slug || category.id,
        isActive: !category.isActive,
      }).unwrap();

      setFeedback({
        type: 'success',
        message: `${category.name} is now ${category.isActive ? 'inactive' : 'active'}. Public category filters will follow this visibility state.`,
      });

      if (selectedCategory?.id === category.id) {
        setSelectedCategory((current) =>
          current
            ? {
                ...current,
                isActive: !category.isActive,
              }
            : current,
        );
      }
    } catch (mutationError) {
      setFeedback({
        type: 'error',
        message: mutationError?.data?.message || 'Could not update category visibility.',
      });
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-violet-300">Admin categories</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Manage category naming and visibility</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          Categories now have a dedicated admin workflow so catalog grouping can evolve without mixing
          category decisions directly into product forms.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Total categories</p>
          <p className="mt-3 text-2xl font-semibold text-white">{categorySummary.total}</p>
        </article>
        <article className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-200">Active categories</p>
          <p className="mt-3 text-2xl font-semibold text-white">{categorySummary.activeCount}</p>
        </article>
        <article className="rounded-3xl border border-amber-400/20 bg-amber-500/10 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-200">Inactive categories</p>
          <p className="mt-3 text-2xl font-semibold text-white">{categorySummary.inactiveCount}</p>
        </article>
        <article className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Assigned products</p>
          <p className="mt-3 text-2xl font-semibold text-white">{categorySummary.assignedProducts}</p>
        </article>
      </div>

      <AdminCategoryForm
        key={selectedCategory?.id || `create-${formResetKey}`}
        category={selectedCategory}
        isSubmitting={isSaving}
        onCancel={() => setSelectedCategory(null)}
        onSubmit={handleCreateOrUpdate}
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

      <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-6 md:grid-cols-2">
        <label className="text-sm text-slate-200">
          Search
          <input
            type="text"
            value={filters.search}
            onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            placeholder="Search by name, slug, or description"
          />
        </label>

        <label className="text-sm text-slate-200">
          Status
          <select
            value={filters.status}
            onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>
      </div>

      {isLoading ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
          Loading managed categories...
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-6 text-sm text-rose-200">
          {error?.data?.message || 'Could not load admin categories.'}
        </div>
      ) : null}

      {!isLoading && !isError ? (
        categories.length ? (
          <AdminCategoriesTable
            categories={categories}
            isToggling={isUpdating}
            onEdit={(category) => setSelectedCategory(category)}
            onToggleStatus={handleToggleStatus}
          />
        ) : (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
            No categories match the current filters yet.
          </div>
        )
      ) : null}
    </section>
  );
}

export default AdminCategoriesPage;

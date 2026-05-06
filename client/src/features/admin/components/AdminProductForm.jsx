import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  getProductFormDefaultValues,
  productFormSchema,
} from '../validation/productFormSchema.js';

function AdminProductForm({ categories = [], isSubmitting = false, onCancel, onSubmit, product }) {
  const isEditing = Boolean(product);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: getProductFormDefaultValues(product),
  });

  useEffect(() => {
    reset(getProductFormDefaultValues(product));
  }, [product, reset]);

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-violet-300">Admin product form</p>
          <h3 className="text-2xl font-semibold text-white">
            {isEditing ? `Editing ${product.name}` : 'Create a new product'}
          </h3>
        </div>
        {isEditing ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-violet-400/30 hover:text-white"
          >
            Clear selection
          </button>
        ) : null}
      </div>

      <form className="mt-6 grid gap-4 lg:grid-cols-2" onSubmit={handleSubmit(onSubmit)} noValidate>
        <label className="text-sm text-slate-200">
          Category
          <select
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            {...register('categoryId')}
          >
            <option value="">Uncategorized</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
                {category.isActive ? '' : ' (inactive)'}
              </option>
            ))}
          </select>
          {errors.categoryId ? (
            <span className="mt-2 block text-xs text-rose-300">{errors.categoryId.message}</span>
          ) : null}
        </label>

        <label className="text-sm text-slate-200">
          SKU
          <input
            type="text"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            {...register('sku')}
          />
          {errors.sku ? <span className="mt-2 block text-xs text-rose-300">{errors.sku.message}</span> : null}
        </label>

        <label className="text-sm text-slate-200 lg:col-span-2">
          Product name
          <input
            type="text"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            {...register('name')}
          />
          {errors.name ? <span className="mt-2 block text-xs text-rose-300">{errors.name.message}</span> : null}
        </label>

        <label className="text-sm text-slate-200 lg:col-span-2">
          Slug
          <input
            type="text"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            {...register('slug')}
          />
          {errors.slug ? <span className="mt-2 block text-xs text-rose-300">{errors.slug.message}</span> : null}
        </label>

        <label className="text-sm text-slate-200 lg:col-span-2">
          Description
          <textarea
            rows="4"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            {...register('description')}
          />
          {errors.description ? (
            <span className="mt-2 block text-xs text-rose-300">{errors.description.message}</span>
          ) : null}
        </label>

        <label className="text-sm text-slate-200">
          Price
          <input
            type="number"
            step="0.01"
            min="0"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            {...register('price')}
          />
          {errors.price ? <span className="mt-2 block text-xs text-rose-300">{errors.price.message}</span> : null}
        </label>

        <label className="text-sm text-slate-200">
          Compare at price
          <input
            type="number"
            step="0.01"
            min="0"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            {...register('compareAtPrice')}
          />
          {errors.compareAtPrice ? (
            <span className="mt-2 block text-xs text-rose-300">{errors.compareAtPrice.message}</span>
          ) : null}
        </label>

        {isEditing ? (
          <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-4 text-sm text-amber-100">
            <p className="font-medium text-white">Current stock: {product.stock}</p>
            <p className="mt-2 leading-6">
              Stock adjustments are handled through the dedicated inventory form below so stock
              movements and audit logs stay explicit.
            </p>
          </div>
        ) : (
          <label className="text-sm text-slate-200">
            Initial stock
            <input
              type="number"
              min="0"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
              {...register('stock')}
            />
            {errors.stock ? <span className="mt-2 block text-xs text-rose-300">{errors.stock.message}</span> : null}
          </label>
        )}

        <label className="text-sm text-slate-200">
          Low stock threshold
          <input
            type="number"
            min="0"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            {...register('lowStockThreshold')}
          />
          {errors.lowStockThreshold ? (
            <span className="mt-2 block text-xs text-rose-300">{errors.lowStockThreshold.message}</span>
          ) : null}
        </label>

        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 lg:col-span-2">
          <input type="checkbox" className="h-4 w-4" {...register('isActive')} />
          Product is visible in the public catalog
        </label>

        <div className="flex flex-wrap gap-3 lg:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-violet-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Save changes' : 'Create product'}
          </button>

          <button
            type="button"
            onClick={() => reset(getProductFormDefaultValues(product))}
            className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-violet-400/30 hover:text-white"
          >
            Reset form
          </button>
        </div>
      </form>
    </section>
  );
}

export default AdminProductForm;

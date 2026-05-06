import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  categoryFormSchema,
  getCategoryFormDefaultValues,
} from '../validation/categoryFormSchema.js';

function AdminCategoryForm({ category, isSubmitting = false, onCancel, onSubmit }) {
  const isEditing = Boolean(category);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: getCategoryFormDefaultValues(category),
  });

  useEffect(() => {
    reset(getCategoryFormDefaultValues(category));
  }, [category, reset]);

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-violet-300">Admin category form</p>
          <h3 className="text-2xl font-semibold text-white">
            {isEditing ? `Editing ${category.name}` : 'Create a new category'}
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
          Category name
          <input
            type="text"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            {...register('name')}
          />
          {errors.name ? <span className="mt-2 block text-xs text-rose-300">{errors.name.message}</span> : null}
        </label>

        <label className="text-sm text-slate-200">
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

        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 lg:col-span-2">
          <input type="checkbox" className="h-4 w-4" {...register('isActive')} />
          Category is visible in public catalog filters
        </label>

        <div className="flex flex-wrap gap-3 lg:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-violet-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Save changes' : 'Create category'}
          </button>

          <button
            type="button"
            onClick={() => reset(getCategoryFormDefaultValues(category))}
            className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-violet-400/30 hover:text-white"
          >
            Reset form
          </button>
        </div>
      </form>
    </section>
  );
}

export default AdminCategoryForm;

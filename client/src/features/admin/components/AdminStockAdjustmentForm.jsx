import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  getStockAdjustmentDefaultValues,
  stockAdjustmentSchema,
} from '../validation/stockAdjustmentSchema.js';

function AdminStockAdjustmentForm({ isSubmitting = false, onCancel, onSubmit, product }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(stockAdjustmentSchema),
    defaultValues: getStockAdjustmentDefaultValues(product),
  });

  useEffect(() => {
    reset(getStockAdjustmentDefaultValues(product));
  }, [product, reset]);

  if (!product) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-amber-400/20 bg-amber-500/10 p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Inventory adjustment</p>
          <h3 className="text-2xl font-semibold text-white">Adjust stock for {product.name}</h3>
          <p className="mt-2 text-sm text-amber-100">
            Current stock: <strong>{product.stock}</strong> · Low-stock threshold:{' '}
            <strong>{product.lowStockThreshold}</strong>
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-100 transition hover:border-amber-300/40"
        >
          Close adjustment
        </button>
      </div>

      <form className="mt-6 grid gap-4 lg:grid-cols-[0.35fr_0.65fr]" onSubmit={handleSubmit(onSubmit)} noValidate>
        <label className="text-sm text-slate-100">
          Quantity change
          <input
            type="number"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            {...register('quantityChange')}
          />
          <span className="mt-2 block text-xs text-amber-100">
            Use positive numbers to restock and negative numbers to reduce inventory.
          </span>
          {errors.quantityChange ? (
            <span className="mt-2 block text-xs text-rose-300">{errors.quantityChange.message}</span>
          ) : null}
        </label>

        <label className="text-sm text-slate-100">
          Reason
          <input
            type="text"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            {...register('reason')}
          />
          {errors.reason ? <span className="mt-2 block text-xs text-rose-300">{errors.reason.message}</span> : null}
        </label>

        <div className="flex flex-wrap gap-3 lg:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-amber-400 px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Updating stock...' : 'Apply stock adjustment'}
          </button>

          <button
            type="button"
            onClick={() => reset(getStockAdjustmentDefaultValues(product))}
            className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-100 transition hover:border-amber-300/40"
          >
            Reset adjustment
          </button>
        </div>
      </form>
    </section>
  );
}

export default AdminStockAdjustmentForm;

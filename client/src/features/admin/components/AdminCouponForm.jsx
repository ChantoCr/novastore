import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { couponFormSchema, getCouponFormDefaultValues } from '../validation/couponFormSchema.js';

function AdminCouponForm({ coupon, isSubmitting = false, onCancel, onSubmit }) {
  const isEditing = Boolean(coupon);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(couponFormSchema),
    defaultValues: getCouponFormDefaultValues(coupon),
  });

  useEffect(() => {
    reset(getCouponFormDefaultValues(coupon));
  }, [coupon, reset]);

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-violet-300">Admin coupon form</p>
          <h3 className="text-2xl font-semibold text-white">
            {isEditing ? `Editing ${coupon.code}` : 'Create a new coupon'}
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
          Code
          <input
            type="text"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 uppercase text-white"
            {...register('code')}
          />
          {errors.code ? <span className="mt-2 block text-xs text-rose-300">{errors.code.message}</span> : null}
        </label>

        <label className="text-sm text-slate-200">
          Discount type
          <select
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            {...register('discountType')}
          >
            <option value="fixed">Fixed amount</option>
            <option value="percentage">Percentage</option>
          </select>
          {errors.discountType ? (
            <span className="mt-2 block text-xs text-rose-300">{errors.discountType.message}</span>
          ) : null}
        </label>

        <label className="text-sm text-slate-200">
          Discount value
          <input
            type="number"
            min="0"
            step="0.01"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            {...register('discountValue')}
          />
          {errors.discountValue ? (
            <span className="mt-2 block text-xs text-rose-300">{errors.discountValue.message}</span>
          ) : null}
        </label>

        <label className="text-sm text-slate-200">
          Minimum purchase amount
          <input
            type="number"
            min="0"
            step="0.01"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            {...register('minPurchaseAmount')}
          />
          {errors.minPurchaseAmount ? (
            <span className="mt-2 block text-xs text-rose-300">{errors.minPurchaseAmount.message}</span>
          ) : null}
        </label>

        <label className="text-sm text-slate-200">
          Usage limit
          <input
            type="number"
            min="1"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            placeholder="Leave blank for unlimited"
            {...register('usageLimit')}
          />
          {errors.usageLimit ? (
            <span className="mt-2 block text-xs text-rose-300">{errors.usageLimit.message}</span>
          ) : null}
        </label>

        <label className="text-sm text-slate-200">
          Starts at
          <input
            type="datetime-local"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            {...register('startsAt')}
          />
          {errors.startsAt ? (
            <span className="mt-2 block text-xs text-rose-300">{errors.startsAt.message}</span>
          ) : null}
        </label>

        <label className="text-sm text-slate-200">
          Expires at
          <input
            type="datetime-local"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            {...register('expiresAt')}
          />
          {errors.expiresAt ? (
            <span className="mt-2 block text-xs text-rose-300">{errors.expiresAt.message}</span>
          ) : null}
        </label>

        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 lg:col-span-2">
          <input type="checkbox" className="h-4 w-4" {...register('isActive')} />
          Coupon is active and available for checkout validation
        </label>

        <div className="flex flex-wrap gap-3 lg:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-violet-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Save changes' : 'Create coupon'}
          </button>

          <button
            type="button"
            onClick={() => reset(getCouponFormDefaultValues(coupon))}
            className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-violet-400/30 hover:text-white"
          >
            Reset form
          </button>
        </div>
      </form>
    </section>
  );
}

export default AdminCouponForm;

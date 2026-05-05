import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

function AdminOrderStatusForm({ order, isSubmitting, onSubmit }) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      status: order?.status || 'pending',
      note: '',
    },
  });

  useEffect(() => {
    reset({
      status: order?.status || 'pending',
      note: '',
    });
  }, [order, reset]);

  if (!order) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-violet-300">Admin control</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Update order status</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Adjust the fulfillment status for order #{order.id}. Rejected payments can only remain
            cancelled.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 grid gap-4 lg:grid-cols-[220px_1fr_auto]">
        <label className="text-sm text-slate-200">
          New status
          <select
            {...register('status')}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-slate-200">
          Internal admin note
          <input
            {...register('note')}
            type="text"
            placeholder="Optional context for the audit log"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
          />
        </label>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-violet-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Saving...' : 'Update status'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AdminOrderStatusForm;

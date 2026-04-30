import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { loginFormSchema } from '../validation/authFormSchemas.js';

function LoginForm({ defaultValues, isSubmitting = false, onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues,
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <label className="block text-sm text-slate-200">
        Email
        <input
          type="email"
          className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none ring-0"
          {...register('email')}
        />
        {errors.email ? <span className="mt-2 block text-xs text-rose-300">{errors.email.message}</span> : null}
      </label>

      <label className="block text-sm text-slate-200">
        Password
        <input
          type="password"
          className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none ring-0"
          {...register('password')}
        />
        {errors.password ? (
          <span className="mt-2 block text-xs text-rose-300">{errors.password.message}</span>
        ) : null}
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-2xl bg-violet-500 px-4 py-3 font-medium text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}

export default LoginForm;

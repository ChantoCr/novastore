import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { checkoutFormSchema } from '../validation/checkoutFormSchema.js';

const addressFields = [
  { name: 'fullName', label: 'Full name', placeholder: 'NOVA User' },
  { name: 'country', label: 'Country', placeholder: 'Demo Country' },
  { name: 'city', label: 'City', placeholder: 'Demo City' },
  { name: 'line1', label: 'Address line 1', placeholder: '123 Portfolio Street' },
  { name: 'line2', label: 'Address line 2', placeholder: 'Apartment, suite, etc. (optional)' },
  { name: 'state', label: 'State / region', placeholder: 'State (optional)' },
  { name: 'postalCode', label: 'Postal code', placeholder: '12345' },
  { name: 'phone', label: 'Phone', placeholder: '+1 555 0100' },
];

function FieldError({ message }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-xs text-rose-300">{message}</p>;
}

function collectErrorMessages(errorTree) {
  if (!errorTree) {
    return [];
  }

  if (typeof errorTree.message === 'string') {
    return [errorTree.message];
  }

  if (Array.isArray(errorTree)) {
    return errorTree.flatMap(collectErrorMessages);
  }

  if (typeof errorTree === 'object') {
    return Object.values(errorTree).flatMap(collectErrorMessages);
  }

  return [];
}

function AddressSection({ title, prefix, register, errors }) {
  return (
    <section className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {addressFields.map((field) => (
          <label key={`${prefix}.${field.name}`} className="text-sm text-slate-200">
            {field.label}
            <input
              {...register(`${prefix}.${field.name}`)}
              type="text"
              placeholder={field.placeholder}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            />
            <FieldError message={errors?.[field.name]?.message} />
          </label>
        ))}
      </div>
    </section>
  );
}

function CheckoutForm({ user, onSubmit, isSubmitting, submitError = null }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitted },
  } = useForm({
    resolver: zodResolver(checkoutFormSchema),
    shouldUnregister: true,
    defaultValues: {
      shippingAddress: {
        fullName: user?.name || '',
        country: 'Demo Country',
        city: 'Demo City',
        line1: '',
        line2: '',
        state: '',
        postalCode: '',
        phone: '',
      },
      billingSameAsShipping: true,
      billingAddress: {
        fullName: user?.name || '',
        country: 'Demo Country',
        city: 'Demo City',
        line1: '',
        line2: '',
        state: '',
        postalCode: '',
        phone: '',
      },
      couponCode: '',
      notes: '',
      paymentMethod: {
        cardholderName: user?.name || '',
        cardNumber: '4242 4242 4242 4242',
        expiryMonth: new Date().getMonth() + 1,
        expiryYear: new Date().getFullYear() + 1,
        cvv: '123',
      },
    },
  });

  const billingSameAsShipping = watch('billingSameAsShipping');
  const validationMessages = Array.from(new Set(collectErrorMessages(errors)));

  function applyDemoCard(cardNumber) {
    setValue('paymentMethod.cardNumber', cardNumber, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }

  return (
    <form
      onSubmit={handleSubmit(
        (values) =>
          onSubmit({
            ...values,
            billingAddress: values.billingSameAsShipping ? undefined : values.billingAddress,
          }),
        () => {
          // Validation errors are surfaced by the summary below.
        },
      )}
      className="space-y-6"
    >
      <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-5 text-sm leading-6 text-emerald-100">
        <p>
          Demo payment scenarios: use a full demo card number ending in <strong>4242</strong> for approval,
          <strong> 0002</strong> for rejection, or <strong>9995</strong> for a pending payment.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() => applyDemoCard('4242 4242 4242 4242')}
            className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-emerald-50 transition hover:bg-white/20"
          >
            Use approved card
          </button>
          <button
            type="button"
            onClick={() => applyDemoCard('4000 0000 0000 0002')}
            className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-emerald-50 transition hover:bg-white/20"
          >
            Use rejected card
          </button>
          <button
            type="button"
            onClick={() => applyDemoCard('4000 0000 0000 9995')}
            className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-emerald-50 transition hover:bg-white/20"
          >
            Use pending card
          </button>
        </div>
      </div>

      {submitError ? (
        <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-5 text-sm text-rose-100">
          <p className="font-medium text-white">Checkout could not be submitted</p>
          <p className="mt-2">{submitError}</p>
        </div>
      ) : null}

      {isSubmitted && validationMessages.length ? (
        <div className="rounded-3xl border border-amber-400/20 bg-amber-500/10 p-5 text-sm text-amber-100">
          <p className="font-medium text-white">Please fix the highlighted fields</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {validationMessages.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <AddressSection
        title="Shipping address"
        prefix="shippingAddress"
        register={register}
        errors={errors.shippingAddress}
      />

      <section className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
        <label className="flex items-center gap-3 text-sm text-slate-200">
          <input {...register('billingSameAsShipping')} type="checkbox" className="h-4 w-4" />
          Billing address is the same as shipping
        </label>

        {!billingSameAsShipping ? (
          <AddressSection
            title="Billing address"
            prefix="billingAddress"
            register={register}
            errors={errors.billingAddress}
          />
        ) : null}
      </section>

      <section className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Coupon and notes</h3>

          <label className="block text-sm text-slate-200">
            Coupon code
            <input
              {...register('couponCode')}
              type="text"
              placeholder="WELCOME10"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            />
            <FieldError message={errors.couponCode?.message} />
          </label>

          <label className="block text-sm text-slate-200">
            Notes
            <textarea
              {...register('notes')}
              rows={4}
              placeholder="Delivery notes or portfolio demo comments"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            />
            <FieldError message={errors.notes?.message} />
          </label>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Payment details</h3>

          <label className="block text-sm text-slate-200">
            Cardholder name
            <input
              {...register('paymentMethod.cardholderName')}
              type="text"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            />
            <FieldError message={errors.paymentMethod?.cardholderName?.message} />
          </label>

          <label className="block text-sm text-slate-200">
            Demo card number
            <input
              {...register('paymentMethod.cardNumber')}
              type="text"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            />
            <FieldError message={errors.paymentMethod?.cardNumber?.message} />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="text-sm text-slate-200">
              Expiry month
              <input
                {...register('paymentMethod.expiryMonth', { valueAsNumber: true })}
                type="number"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
              />
              <FieldError message={errors.paymentMethod?.expiryMonth?.message} />
            </label>

            <label className="text-sm text-slate-200">
              Expiry year
              <input
                {...register('paymentMethod.expiryYear', { valueAsNumber: true })}
                type="number"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
              />
              <FieldError message={errors.paymentMethod?.expiryYear?.message} />
            </label>

            <label className="text-sm text-slate-200">
              CVV
              <input
                {...register('paymentMethod.cvv')}
                type="text"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
              />
              <FieldError message={errors.paymentMethod?.cvv?.message} />
            </label>
          </div>
        </div>
      </section>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-full bg-violet-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Processing checkout...' : 'Place simulated order'}
      </button>
    </form>
  );
}

export default CheckoutForm;

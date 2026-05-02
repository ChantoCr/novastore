import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import CartSummaryCard from '../features/cart/components/CartSummaryCard.jsx';
import { clearCart, selectCartSummary } from '../features/cart/cartSlice.js';
import { useCreateCheckoutMutation } from '../features/checkout/api/checkoutApi.js';
import CheckoutForm from '../features/checkout/components/CheckoutForm.jsx';
import { formatCurrency } from '../utils/currency.js';

function CheckoutPage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { items, itemCount, subtotal } = useSelector(selectCartSummary);
  const [createCheckout, { isLoading }] = useCreateCheckoutMutation();
  const [checkoutResult, setCheckoutResult] = useState(null);
  const [checkoutError, setCheckoutError] = useState(null);

  const checkoutItems = useMemo(
    () => items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
    [items],
  );

  async function handleCheckoutSubmit(values) {
    setCheckoutError(null);

    try {
      const response = await createCheckout({
        items: checkoutItems,
        couponCode: values.couponCode || undefined,
        shippingAddress: values.shippingAddress,
        billingAddress: values.billingAddress,
        paymentMethod: values.paymentMethod,
        notes: values.notes || undefined,
      }).unwrap();

      setCheckoutResult(response.data);

      if (response.data.payment.status !== 'rejected') {
        dispatch(clearCart());
      }
    } catch (error) {
      setCheckoutError(error?.data?.message || 'Checkout could not be processed.');
    }
  }

  if (!items.length && !checkoutResult) {
    return (
      <section className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="text-xs uppercase tracking-[0.35em] text-violet-300">Checkout</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Your cart is empty</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Add products to the cart before starting checkout.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/products"
              className="rounded-full bg-violet-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-400"
            >
              Browse products
            </Link>
            <Link
              to="/cart"
              className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-100 transition hover:border-violet-400/30"
            >
              Back to cart
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const shouldShowForm = !checkoutResult || checkoutResult.payment.status === 'rejected';

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-violet-300">Checkout</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Simulated payment and order creation</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          The frontend sends only cart item identifiers and quantities. The backend recalculates totals,
          validates stock, applies coupons, simulates payment, creates the order, and reduces stock only
          when the payment is approved.
        </p>
      </div>

      {checkoutResult ? (
        <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-6 text-sm leading-7 text-emerald-100">
          <h3 className="text-xl font-semibold text-white">Checkout result</h3>
          <p className="mt-3">
            Order #{checkoutResult.order.id} finished with payment status{' '}
            <strong>{checkoutResult.payment.status}</strong>.
          </p>
          <p>
            Final total: <strong>{formatCurrency(checkoutResult.order.total)}</strong> · Provider reference:{' '}
            <strong>{checkoutResult.payment.providerReference}</strong>
          </p>
          <p>{checkoutResult.payment.message}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/account"
              className="rounded-full bg-violet-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-400"
            >
              Go to account
            </Link>
            <Link
              to="/products"
              className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-100 transition hover:border-violet-400/30"
            >
              Keep shopping
            </Link>
          </div>
        </div>
      ) : null}

      {checkoutError ? (
        <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-5 text-sm text-rose-200">
          {checkoutError}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          {shouldShowForm ? <CheckoutForm user={user} onSubmit={handleCheckoutSubmit} isSubmitting={isLoading} /> : null}
        </div>

        <div className="space-y-6">
          <CartSummaryCard
            itemCount={itemCount}
            subtotal={subtotal}
            checkoutHref="/checkout"
            isCheckoutDisabled={!items.length}
          />

          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-violet-300">Backend enforcement</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
              <li>• Product prices are reloaded from the database</li>
              <li>• Coupon rules are validated server-side</li>
              <li>• Tax is simulated at an 8% backend rate</li>
              <li>• Stock is reduced only when payment is approved</li>
              <li>• Notifications and payment records are created on the server</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CheckoutPage;

import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import CartSummaryCard from '../features/cart/components/CartSummaryCard.jsx';
import { clearCart, selectCartSummary } from '../features/cart/cartSlice.js';
import { useCreateCheckoutMutation } from '../features/checkout/api/checkoutApi.js';
import CheckoutForm from '../features/checkout/components/CheckoutForm.jsx';
import { formatCurrency } from '../utils/currency.js';

const checkoutResultStyles = {
  approved: {
    container: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-100',
    iconWrapper: 'border-emerald-300/30 bg-emerald-400/15 text-emerald-100',
    iconAnimation: 'animate-pulse',
    icon: '✓',
    title: 'Order approved',
    detail: 'Payment was approved, the order was created, and the cart was cleared.',
  },
  pending: {
    container: 'border-amber-400/20 bg-amber-500/10 text-amber-100',
    iconWrapper: 'border-amber-300/30 bg-amber-400/15 text-amber-100',
    iconAnimation: 'animate-bounce',
    icon: '…',
    title: 'Order pending confirmation',
    detail: 'The order was created as pending. Stock was not reduced, and your cart was preserved while you review the result.',
  },
  rejected: {
    container: 'border-rose-400/20 bg-rose-500/10 text-rose-100',
    iconWrapper: 'border-rose-300/30 bg-rose-400/15 text-rose-100',
    iconAnimation: 'animate-pulse',
    icon: '×',
    title: 'Payment rejected',
    detail: 'The simulated payment was rejected. Your cart was preserved so you can change the card and try again.',
  },
};

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
    setCheckoutResult(null);

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

      if (response.data.payment.status === 'approved') {
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
        <div className="space-y-4">
          <div
            className={`rounded-3xl border p-6 text-sm leading-7 shadow-2xl shadow-slate-950/30 ${
              checkoutResultStyles[checkoutResult.payment.status]?.container ||
              checkoutResultStyles.pending.container
            }`}
          >
            <div className="flex flex-wrap items-center gap-4">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-full border text-3xl font-semibold ${
                  checkoutResultStyles[checkoutResult.payment.status]?.iconWrapper ||
                  checkoutResultStyles.pending.iconWrapper
                } ${
                  checkoutResultStyles[checkoutResult.payment.status]?.iconAnimation ||
                  checkoutResultStyles.pending.iconAnimation
                }`}
              >
                {checkoutResultStyles[checkoutResult.payment.status]?.icon || checkoutResultStyles.pending.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {checkoutResultStyles[checkoutResult.payment.status]?.title || 'Checkout result'}
                </h3>
                <p className="text-sm text-slate-100/80">
                  Status: <strong>{checkoutResult.payment.status}</strong>
                </p>
              </div>
            </div>
            <p className="mt-3">
              Order #{checkoutResult.order.id} finished with payment status{' '}
              <strong>{checkoutResult.payment.status}</strong>.
            </p>
            <p>{checkoutResultStyles[checkoutResult.payment.status]?.detail}</p>
            <p>
              Final total: <strong>{formatCurrency(checkoutResult.order.total)}</strong> · Provider reference:{' '}
              <strong>{checkoutResult.payment.providerReference}</strong>
            </p>
            <p>{checkoutResult.payment.message}</p>
            <p>
              Backend stock reduction:{' '}
              <strong>{checkoutResult.simulation.stockReduced ? 'applied' : 'not applied'}</strong>
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to={`/account?orderId=${checkoutResult.order.id}`}
                className="rounded-full bg-violet-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-400"
              >
                View this order in account
              </Link>
              <Link
                to="/account"
                className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-100 transition hover:border-violet-400/30"
              >
                Open account history
              </Link>
              <Link
                to="/products"
                className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-100 transition hover:border-violet-400/30"
              >
                Keep shopping
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-violet-300">Order summary</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">Order #{checkoutResult.order.id}</h3>
              </div>
              <div className="text-right text-sm text-slate-300">
                <p>
                  Payment: <span className="font-medium capitalize text-white">{checkoutResult.payment.status}</span>
                </p>
                <p>
                  Card ending: <span className="font-medium text-white">{checkoutResult.payment.cardLast4}</span>
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {checkoutResult.order.items.map((item) => (
                <div
                  key={`${checkoutResult.order.id}-${item.productId}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300"
                >
                  <div>
                    <p className="font-medium text-white">{item.productName}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">{item.productSku}</p>
                  </div>
                  <div className="text-right">
                    <p>
                      {item.quantity} × {formatCurrency(item.unitPrice)}
                    </p>
                    <p className="font-medium text-white">{formatCurrency(item.lineTotal)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Subtotal</p>
                <p className="mt-3 text-lg font-semibold text-white">
                  {formatCurrency(checkoutResult.order.subtotal)}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Discount</p>
                <p className="mt-3 text-lg font-semibold text-white">
                  {formatCurrency(checkoutResult.order.discountTotal)}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Tax</p>
                <p className="mt-3 text-lg font-semibold text-white">
                  {formatCurrency(checkoutResult.order.taxTotal)}
                </p>
              </div>
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                <p className="text-xs uppercase tracking-[0.25em] text-emerald-200">Final total</p>
                <p className="mt-3 text-lg font-semibold text-white">
                  {formatCurrency(checkoutResult.order.total)}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          {shouldShowForm ? (
            <CheckoutForm
              user={user}
              onSubmit={handleCheckoutSubmit}
              isSubmitting={isLoading}
              submitError={checkoutError}
            />
          ) : null}
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

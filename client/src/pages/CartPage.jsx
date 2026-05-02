import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import CartItemCard from '../features/cart/components/CartItemCard.jsx';
import CartSummaryCard from '../features/cart/components/CartSummaryCard.jsx';
import {
  clearCart,
  removeItem,
  selectCartItemCount,
  selectCartItems,
  selectCartSubtotal,
  updateItemQuantity,
} from '../features/cart/cartSlice.js';

function CartPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const itemCount = useSelector(selectCartItemCount);
  const subtotal = useSelector(selectCartSubtotal);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!items.length) {
    return (
      <section className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="text-xs uppercase tracking-[0.35em] text-violet-300">Cart</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Your cart is empty</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Add products from the catalog to start the local Redux cart flow. Checkout stays protected,
            but guests can build a cart before signing in.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex rounded-full bg-violet-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-400"
          >
            Browse products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-violet-300">Cart</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Local cart and checkout handoff</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Cart state is stored client-side with Redux and local storage persistence. Final totals,
            coupons, payment simulation, and stock enforcement happen on the backend during checkout.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => dispatch(clearCart())}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-rose-400/30 hover:text-white"
          >
            Clear cart
          </button>
        </div>
      </div>

      {!isAuthenticated ? (
        <div className="rounded-3xl border border-amber-400/20 bg-amber-500/10 p-5 text-sm leading-6 text-amber-100">
          You can build a cart as a guest, but checkout requires an authenticated account.
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-4">
          {items.map((item) => (
            <CartItemCard
              key={item.productId}
              item={item}
              onDecrease={() =>
                dispatch(updateItemQuantity({ productId: item.productId, quantity: item.quantity - 1 }))
              }
              onIncrease={() =>
                dispatch(updateItemQuantity({ productId: item.productId, quantity: item.quantity + 1 }))
              }
              onRemove={() => dispatch(removeItem(item.productId))}
            />
          ))}
        </div>

        <CartSummaryCard itemCount={itemCount} subtotal={subtotal} isCheckoutDisabled={!items.length} />
      </div>
    </section>
  );
}

export default CartPage;

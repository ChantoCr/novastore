import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { addToast } from '../../ui/uiSlice.js';
import {
  useAddWishlistItemMutation,
  useGetWishlistQuery,
  useRemoveWishlistItemMutation,
} from '../api/wishlistApi.js';

const emptyWishlistItems = [];

function WishlistToggleButton({ product, className = '', fullWidth = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const authBootstrapStatus = useSelector((state) => state.auth.authBootstrapStatus);
  const isAuthResolving = authBootstrapStatus !== 'complete';

  const { data } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [addWishlistItem, { isLoading: isAdding }] = useAddWishlistItemMutation();
  const [removeWishlistItem, { isLoading: isRemoving }] = useRemoveWishlistItemMutation();

  const wishlistItems = data?.data?.items || emptyWishlistItems;
  const isWishlisted = wishlistItems.some((item) => item.id === product?.id);
  const isSubmitting = isAdding || isRemoving;

  async function handleClick() {
    if (!product?.id || isAuthResolving) {
      return;
    }

    if (!isAuthenticated) {
      dispatch(
        addToast({
          title: 'Sign in required',
          message: 'Log in to save products to your wishlist.',
          type: 'info',
        }),
      );
      navigate('/login', {
        state: { from: { pathname: location.pathname } },
      });
      return;
    }

    try {
      if (isWishlisted) {
        await removeWishlistItem(product.id).unwrap();
        dispatch(
          addToast({
            title: 'Removed from wishlist',
            message: `${product.name} was removed from your saved items.`,
            type: 'info',
          }),
        );
      } else {
        await addWishlistItem({ productId: product.id }).unwrap();
        dispatch(
          addToast({
            title: 'Saved to wishlist',
            message: `${product.name} was saved for later.`,
            type: 'success',
          }),
        );
      }
    } catch (error) {
      dispatch(
        addToast({
          title: 'Wishlist update failed',
          message: error?.data?.message || 'Please try again in a moment.',
          type: error?.status === 409 ? 'info' : 'error',
        }),
      );
    }
  }

  const label = isAuthResolving
    ? 'Checking session...'
    : isSubmitting
      ? 'Saving...'
      : isWishlisted
        ? 'Saved'
        : 'Save';

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isSubmitting || isAuthResolving}
      className={`${fullWidth ? 'w-full justify-center' : ''} inline-flex items-center rounded-full border px-4 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
        isWishlisted
          ? 'border-violet-400/30 bg-violet-500/10 text-violet-100 hover:bg-violet-500/20'
          : 'border-white/10 bg-white/5 text-slate-100 hover:border-violet-400/30'
      } ${className}`.trim()}
      aria-pressed={isWishlisted}
    >
      {isWishlisted ? '♥ ' : '♡ '}
      {label}
    </button>
  );
}

export default WishlistToggleButton;

const CART_STORAGE_KEY = 'nova-store-cart';

export function loadCartState() {
  if (typeof window === 'undefined') {
    return {
      items: [],
    };
  }

  try {
    const rawValue = window.localStorage.getItem(CART_STORAGE_KEY);

    if (!rawValue) {
      return {
        items: [],
      };
    }

    const parsed = JSON.parse(rawValue);

    return {
      items: Array.isArray(parsed?.items) ? parsed.items : [],
    };
  } catch {
    return {
      items: [],
    };
  }
}

export function saveCartState(cartState) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({
        items: cartState.items,
      }),
    );
  } catch {
    // ignore storage failures
  }
}

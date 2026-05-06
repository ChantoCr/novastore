# Redux Skill — NOVA Store

## Purpose
Use this skill when working with Redux Toolkit, RTK Query, cart state, auth state, wishlist state, filters, and API cache.

## Stack
- Redux Toolkit
- RTK Query
- React Redux

## Store Slices

```txt
authSlice
cartSlice
uiSlice
filtersSlice
notificationsSlice
```

Notes:
- `uiSlice` can be used for lightweight client-only feedback such as toast notifications and temporary interface state.
- Persist only what is safe and necessary; feedback UI state generally should not be persisted across sessions.

## RTK Query APIs

```txt
authApi
productsApi
ordersApi
wishlistApi
reviewsApi
couponsApi
adminApi
notificationsApi
```

## Rules
- Use Redux Toolkit, not legacy Redux patterns.
- Use RTK Query for server data.
- Use slices for client-only state.
- Cart can be local Redux state first, then synced to backend later.
- Keep selectors clean.
- Avoid unnecessary global state.
- Normalize patterns across features.

## Cart State Should Include
- items
- quantity
- subtotal
- discount
- total
- appliedCoupon

## Auth State Should Include
- user
- accessToken
- isAuthenticated
- role

## Good Patterns
- Keep derived totals in selectors when possible.
- Use RTK Query tags for cache invalidation.
- Reset auth-sensitive state on logout.
- Persist only what is safe and necessary.

## Avoid
- Manual reducers with excessive boilerplate.
- Fetching server data with useEffect when RTK Query is better.
- Storing duplicate server data in slices unnecessarily.
- Persisting sensitive tokens in unsafe places without a clear strategy.

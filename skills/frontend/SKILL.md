# Frontend Skill — NOVA Store

## Purpose
Use this skill when working on React.js, layouts, pages, components, routing, UI, responsive design, dark mode, animations, accessibility, and frontend architecture.

## Stack
- React.js
- JavaScript
- Vite
- React Router
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Lucide React
- React Hook Form
- Zod

## Rules
- Use feature-based structure.
- Keep components small and reusable.
- Separate layout components from page components.
- Use React hooks correctly.
- Avoid unnecessary re-renders.
- Use loading, error, empty, and success states.
- Use semantic HTML when possible.
- Design must look premium and portfolio-ready.
- Use responsive design from the beginning.
- Prefer accessible components and keyboard-friendly interactions.

## Recommended Structure

```txt
client/src/
├── app/
├── components/
│   ├── ui/
│   ├── shared/
│   └── layout/
├── features/
│   ├── auth/
│   ├── products/
│   ├── cart/
│   ├── orders/
│   ├── wishlist/
│   ├── reviews/
│   └── admin/
├── layouts/
├── pages/
├── router/
├── services/
├── hooks/
├── utils/
└── styles/
```

## UI Direction
- Modern SaaS/e-commerce style.
- Clean dashboard layout.
- Dark mode support.
- Premium cards.
- Soft shadows.
- Rounded corners.
- Smooth animations.
- Minimal but impressive.

## Must Include
- PublicLayout
- AuthLayout
- UserLayout
- AdminLayout
- ProtectedRoute component
- RoleProtectedRoute component
- Navbar
- Sidebar
- ProductCard
- ProductGrid
- CartItem
- OrderCard
- AdminMetricCard
- DataTable-style components

## State & Data Rules
- Use RTK Query for backend data fetching and caching.
- Use Redux slices only for client-side state that must be global.
- Keep form state local unless it must be shared.
- Avoid prop drilling when composition or context can solve it cleanly.

## UX Expectations
- Show skeletons or loaders for slow views.
- Handle network failures gracefully.
- Prevent duplicate submissions on forms.
- Surface validation messages clearly.
- Use optimistic UI only when rollback behavior is understood.

## Avoid
- Overloaded components.
- Hardcoded repeated UI.
- Inline styles unless necessary.
- API calls directly inside deeply nested components.
- Mixing admin UI patterns into public user flows without clear separation.

import { createBrowserRouter } from 'react-router-dom';

import ProtectedRoute from '../components/layout/ProtectedRoute.jsx';
import RoleProtectedRoute from '../components/layout/RoleProtectedRoute.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import PublicLayout from '../layouts/PublicLayout.jsx';
import AccountPage from '../pages/AccountPage.jsx';
import AdminAuditLogsPage from '../pages/AdminAuditLogsPage.jsx';
import AdminCategoriesPage from '../pages/AdminCategoriesPage.jsx';
import AdminCouponsPage from '../pages/AdminCouponsPage.jsx';
import AdminOrdersPage from '../pages/AdminOrdersPage.jsx';
import AdminProductsPage from '../pages/AdminProductsPage.jsx';
import CartPage from '../pages/CartPage.jsx';
import CheckoutPage from '../pages/CheckoutPage.jsx';
import HomePage from '../pages/HomePage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import NotificationsPage from '../pages/NotificationsPage.jsx';
import ProductDetailPage from '../pages/ProductDetailPage.jsx';
import ProductsPage from '../pages/ProductsPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import WishlistPage from '../pages/WishlistPage.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'products',
        element: <ProductsPage />,
      },
      {
        path: 'products/:productIdOrSlug',
        element: <ProductDetailPage />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'account',
        element: (
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'wishlist',
        element: (
          <ProtectedRoute>
            <WishlistPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'notifications',
        element: (
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <RoleProtectedRoute allowedRoles={['admin']}>
        <AdminLayout />
      </RoleProtectedRoute>
    ),
    children: [
      {
        path: 'categories',
        element: <AdminCategoriesPage />,
      },
      {
        path: 'products',
        element: <AdminProductsPage />,
      },
      {
        path: 'orders',
        element: <AdminOrdersPage />,
      },
      {
        path: 'coupons',
        element: <AdminCouponsPage />,
      },
      {
        path: 'audit-logs',
        element: <AdminAuditLogsPage />,
      },
    ],
  },
]);

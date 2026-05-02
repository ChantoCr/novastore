import { createBrowserRouter } from 'react-router-dom';

import ProtectedRoute from '../components/layout/ProtectedRoute.jsx';
import RoleProtectedRoute from '../components/layout/RoleProtectedRoute.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import PublicLayout from '../layouts/PublicLayout.jsx';
import AccountPage from '../pages/AccountPage.jsx';
import AdminProductsPage from '../pages/AdminProductsPage.jsx';
import CartPage from '../pages/CartPage.jsx';
import CheckoutPage from '../pages/CheckoutPage.jsx';
import HomePage from '../pages/HomePage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import ProductDetailPage from '../pages/ProductDetailPage.jsx';
import ProductsPage from '../pages/ProductsPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';

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
        path: 'products',
        element: <AdminProductsPage />,
      },
    ],
  },
]);

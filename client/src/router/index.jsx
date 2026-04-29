import { createBrowserRouter } from 'react-router-dom';

import PublicLayout from '../layouts/PublicLayout.jsx';
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
    ],
  },
]);

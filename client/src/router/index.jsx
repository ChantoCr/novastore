import { createBrowserRouter } from 'react-router-dom';

import PublicLayout from '../layouts/PublicLayout.jsx';
import HomePage from '../pages/HomePage.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
]);

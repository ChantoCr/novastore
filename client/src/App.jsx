import { RouterProvider } from 'react-router-dom';

import { useAuthBootstrap } from './features/auth/hooks/useAuthBootstrap.js';
import { router } from './router/index.jsx';

function App() {
  useAuthBootstrap();

  return <RouterProvider router={router} />;
}

export default App;

import { createBrowserRouter } from 'react-router-dom';
import { HomePage, SubPage } from './pages';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <div>Unknown Error</div>,
  },
  {
    path: '/sub',
    element: <SubPage />,
    errorElement: <div>Unknown Error</div>,
  },
]);

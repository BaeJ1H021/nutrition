import { createBrowserRouter } from 'react-router-dom';
import { HomePage, OnboardingPage } from './pages';
import { FullScreen } from './components/molecules';

export const router = createBrowserRouter([
  {
    element: <FullScreen />,
    children: [
      {
        path: '/',
        element: <HomePage />,
        errorElement: <div>Unknown Error</div>,
      },
      {
        path: '/onboarding',
        element: <OnboardingPage />,
        errorElement: <div>Unknown Error</div>,
      },
    ],
  },
]);

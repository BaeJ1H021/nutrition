import { createBrowserRouter } from 'react-router-dom';
import {
  HomePage,
  OnboardingPage,
  SignUpEmailPage,
  SignUpPasswordPage,
  SignUpVerifyPage,
  WelcomePage,
} from './pages';
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
      {
        path: '/signup/email',
        element: <SignUpEmailPage />,
      },
      {
        path: '/signup/password',
        element: <SignUpPasswordPage />,
      },
      {
        path: '/signup/verify',
        element: <SignUpVerifyPage />,
      },
      {
        path: '/welcome',
        element: <WelcomePage />,
      },
    ],
  },
]);

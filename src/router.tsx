import { createBrowserRouter, Navigate } from 'react-router-dom';
import {
  AuthCallbackPage,
  HomePage,
  LoginPage,
  OnboardingPage,
  ProfileBirthdayPage,
  ProfileBodyPage,
  ProfileEndPage,
  ProfileGenderPage,
  ResetPasswordPage,
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
        element: <Navigate to="/onboarding" replace />,
      },
      {
        path: '/home',
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
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/auth/callback',
        element: <AuthCallbackPage />,
      },
      {
        path: '/reset-password',
        element: <ResetPasswordPage />,
      },
      {
        path: '/profile/gender',
        element: <ProfileGenderPage />,
      },
      {
        path: '/profile/birthday',
        element: <ProfileBirthdayPage />,
      },
      {
        path: '/profile/body',
        element: <ProfileBodyPage />,
      },
      {
        path: '/profile/end',
        element: <ProfileEndPage />,
      },
    ],
  },
]);

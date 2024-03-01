import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Chat from './pages/Chat.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import UpdatePassword from './pages/UpdatePassword.jsx';
import Incognito from './pages/Incognito.jsx';
import About from './pages/About.jsx';
import FourOhFour from './pages/FourOhFour.jsx';
import { ThemeProviderWrapper } from './contexts/ThemeContext'; // Import the ThemeProviderWrapper

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
    errorElement: <FourOhFour />,
  },
  {
    path: '/chat',
    element: (
      <ProtectedRoute>
        {' '}
        <Chat />{' '}
      </ProtectedRoute>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/update-password',
    element: <UpdatePassword />,
  },
  {
    path: '/incognito',
    element: <Incognito />,
  },
  {
    path: '/about',
    element: <About />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProviderWrapper>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProviderWrapper>
  </React.StrictMode>
);

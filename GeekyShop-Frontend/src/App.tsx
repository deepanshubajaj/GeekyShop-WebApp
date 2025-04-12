import { Component } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/pages/Layout';
import Home from './components/pages/Home';
import Contact from './components/pages/Contact';
import LoginReg from './components/pages/auth/LoginReg';
import About from './components/pages/About';
import SendPasswordResetEmail from './components/pages/auth/SendPasswordResetEmail';
import ResetPassword from './components/pages/auth/ResetPassword';
import PrivateRoute from './privateRoutes/PrivateRoute';
import PrivateRouteRP from './privateRoutes/PrivateRouteRP';
import VideoPlay from './components/pages/VideoPlay';
import Game from './components/pages/Game';
import Ethereal from './components/pages/Ethereal';
import SecretGame from './components/pages/SecretGame';

// Define the router with future flags
const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: (
            <PrivateRoute element={<Home />} /> // Protect the Home route with PrivateRoute
          ),
        },
        { path: 'contact', element: <Contact /> },
        { path: 'login', element: <LoginReg /> },
        { path: 'register', element: <LoginReg /> },
        { path: 'about', element: <About /> },
        { path: 'sendpasswordresetemail', element: <SendPasswordResetEmail /> },
        {
          path: 'resetpassword',
          element: (
            <PrivateRouteRP element={<ResetPassword />} /> // Protect the ResetPassword route
          ),
        },
        { path: 'videoplay', element: <VideoPlay /> },
        { path: 'game', element: <Game /> },
        { path: 'ethereal', element: <Ethereal /> },
        {
          path: 'secretgame',
          element: (
            <PrivateRoute element={<SecretGame />} /> // Protect the SecretGame route
          ),
        },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  }
);

class App extends Component {
  render() {
    return <RouterProvider router={router} />;
  }
}

export default App;

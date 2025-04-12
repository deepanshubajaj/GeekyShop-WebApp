import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';

// Define the prop types for PrivateRoute
interface PrivateRouteProps {
  element: React.ReactNode;
}

class PrivateRoute extends Component<PrivateRouteProps> {
  render() {
    const { element } = this.props;
    const userIsUp = localStorage.getItem('userIsUp');

    if (!userIsUp) {
      return <Navigate to="/login" replace />;
    }

    return <>{element}</>;
  }
}

export default PrivateRoute;

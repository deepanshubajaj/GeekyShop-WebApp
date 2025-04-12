import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';

// Define the prop types for PrivateRoute
interface PrivateRouteProps {
  element: React.ReactNode;
}

class PrivateRouteRP extends Component<PrivateRouteProps> {
  render() {
    const { element } = this.props;
    const userIsUp = localStorage.getItem('userIsUpRP');

    if (!userIsUp) {
      return <Navigate to="/sendpasswordresetemail" replace />;
    }

    return <>{element}</>;
  }
}

export default PrivateRouteRP;

// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, ...rest }) => {
    const token = localStorage.getItem('token');

    // Return a route that either renders the element or navigates to /signin
    return token ? element : <Navigate to="/signin" />;
};

export default PrivateRoute;

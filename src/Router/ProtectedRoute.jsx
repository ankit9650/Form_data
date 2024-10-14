import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('jwtToken'); // Check for the token
    
    return token ? children : <Navigate to="/login" />; // Redirect to login if no token
};

export default ProtectedRoute;

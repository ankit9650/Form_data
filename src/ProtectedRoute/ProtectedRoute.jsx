import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

function ProtectedRoute() {
    const user = true; 

    return user ? <Outlet /> : <Navigate to="/login"  />;
}

export default ProtectedRoute;

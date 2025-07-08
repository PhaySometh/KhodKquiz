import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// TODO: Add requiredRole
const ProtectedRoute = ({ redirectTo = '/login' }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-16 h-16 bg-yellow-500 rounded-full mb-4"></div>
                    <div className="h-6 bg-gray-700 rounded w-48 mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-64"></div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Save the attempted location for redirect after login
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;

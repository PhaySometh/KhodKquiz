import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../LoadingSpinner';

const ProtectedRoute = ({
    requiredRole,
    requiredRoles = [],
    redirectTo = '/login',
    unauthorizedRedirect = '/unauthorized',
}) => {
    const { user, isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-900 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <LoadingSpinner size="large" />
                    <p className="text-white mt-4 text-lg">
                        Verifying access...
                    </p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Save the attempted location for redirect after login
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // Check role-based access
    if (requiredRole || requiredRoles.length > 0) {
        const userRole = user?.role;

        // Check single required role
        if (requiredRole && userRole !== requiredRole) {
            return <Navigate to={unauthorizedRedirect} replace />;
        }

        // Check multiple allowed roles
        if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
            return <Navigate to={unauthorizedRedirect} replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;

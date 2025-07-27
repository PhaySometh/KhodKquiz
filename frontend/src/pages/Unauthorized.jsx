import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Unauthorized Access Page
 * 
 * Displayed when users try to access routes they don't have permission for.
 * Provides clear messaging and navigation options based on user role.
 */
const Unauthorized = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoHome = () => {
        navigate('/');
    };

    const getRoleBasedMessage = () => {
        if (!isAuthenticated) {
            return {
                title: "Authentication Required",
                message: "You need to sign in to access this page.",
                suggestion: "Please sign in to continue."
            };
        }

        switch (user?.role) {
            case 'student':
                return {
                    title: "Access Restricted",
                    message: "This page is only available to teachers and administrators.",
                    suggestion: "If you're an educator, you can apply for teacher access from your profile."
                };
            case 'teacher':
                return {
                    title: "Admin Access Required",
                    message: "This page is restricted to administrators only.",
                    suggestion: "Contact an administrator if you need access to this feature."
                };
            case 'admin':
                return {
                    title: "Unexpected Error",
                    message: "You should have access to this page. This might be a system error.",
                    suggestion: "Please try refreshing the page or contact support."
                };
            default:
                return {
                    title: "Access Denied",
                    message: "You don't have permission to access this page.",
                    suggestion: "Please check your account permissions."
                };
        }
    };

    const { title, message, suggestion } = getRoleBasedMessage();

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-900 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="bg-orange-400 p-4 rounded-full">
                        <Shield className="w-12 h-12 text-white" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-white mb-4">
                    {title}
                </h1>

                {/* Message */}
                <p className="text-blue-100 text-lg mb-2">
                    {message}
                </p>

                {/* Suggestion */}
                <p className="text-blue-200 text-sm mb-8">
                    {suggestion}
                </p>

                {/* User Info */}
                {isAuthenticated && user && (
                    <div className="bg-blue-800 bg-opacity-50 rounded-lg p-4 mb-6">
                        <p className="text-blue-100 text-sm">
                            Signed in as: <span className="font-semibold text-white">{user.name}</span>
                        </p>
                        <p className="text-blue-200 text-xs">
                            Role: <span className="capitalize font-medium">{user.role}</span>
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={handleGoBack}
                        className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Go Back
                    </button>

                    <button
                        onClick={handleGoHome}
                        className="w-full bg-transparent border-2 border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                        <Home className="w-5 h-5" />
                        Go to Home
                    </button>

                    {/* Role-specific action */}
                    {isAuthenticated && user?.role === 'student' && (
                        <button
                            onClick={() => navigate('/profile')}
                            className="w-full bg-transparent border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                        >
                            Apply for Teacher Access
                        </button>
                    )}

                    {!isAuthenticated && (
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full bg-transparent border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                        >
                            Sign In
                        </button>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-blue-800">
                    <p className="text-blue-300 text-xs">
                        Need help? Contact our support team for assistance.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;

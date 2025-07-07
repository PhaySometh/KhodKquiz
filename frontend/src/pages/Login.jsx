import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, UserPlus } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const BASE_URL = 'http://localhost:3000';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, loginWithEmail, loginLoading } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    // Form state for traditional login
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [formErrors, setFormErrors] = useState({});

    // Get the intended destination from location state, default to dashboard
    const from = location.state?.from?.pathname || '/';

    const handleLoginSuccess = async (credentialResponse) => {
        setIsLoading(true);
        try {
            // Add minimum loading time for better UX
            const [response] = await Promise.all([
                axios.post(`${BASE_URL}/api/user/auth/google-login`, {
                    token: credentialResponse.credential,
                }),
                new Promise((resolve) => setTimeout(resolve, 1200)), // Minimum 1.2 seconds loading
            ]);

            if (response.data.token) {
                const loginSuccess = await login(response.data.token);
                if (loginSuccess) {
                    // Redirect to intended destination or dashboard
                    navigate(from, { replace: true });
                }
            } else {
                console.error(
                    'Login failed: No token received:',
                    response.data.error
                );
                toast.error('Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during Google login:', error);
            toast.error(
                'Login failed. Please check your connection and try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginError = () => {
        toast.error('Login was cancelled or failed. Please try again.');
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error for this field when user starts typing
        if (formErrors[name]) {
            setFormErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    // Validate form data
    const validateForm = () => {
        const errors = {};

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                errors.email = 'Invalid email format';
            }
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        }

        return errors;
    };

    // Handle traditional email/password login
    const handleEmailLogin = async (e) => {
        e.preventDefault();

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const success = await loginWithEmail(
            formData.email.trim(),
            formData.password
        );

        if (success) {
            navigate(from, { replace: true });
        }
    };

    return (
        <>
            <div className="w-full">
                <Navbar />
            </div>
            <div className="flex justify-center items-center min-h-screen bg-gray-50 py-20">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 mx-4">
                    {/* Header with Icon */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-950 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LogIn size={24} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-gray-600">
                            Sign in to continue your coding journey
                        </p>
                    </div>

                    {/* Google Login */}
                    <div className="mb-6 relative flex justify-center items-center w-full">
                        {isLoading && (
                            <div className="absolute inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center rounded-md z-10">
                                <LoadingSpinner
                                    size="md"
                                    text="Signing you in..."
                                    variant="writing"
                                />
                            </div>
                        )}
                        <GoogleLogin
                            onSuccess={handleLoginSuccess}
                            onError={handleLoginError}
                            theme="outline"
                            size="large"
                            width="100%"
                            disabled={isLoading || loginLoading}
                        />
                    </div>

                    {/* Divider */}
                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t border-gray-200"></div>
                        <span className="px-4 text-sm text-gray-500">
                            or continue with email
                        </span>
                        <div className="flex-1 border-t border-gray-200"></div>
                    </div>

                    {/* Email Form */}
                    <form className="space-y-4" onSubmit={handleEmailLogin}>
                        <div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Email address"
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                                    formErrors.email
                                        ? 'border-red-300 focus:ring-red-400'
                                        : 'border-gray-300 focus:ring-blue-950'
                                }`}
                                disabled={loginLoading}
                            />
                            {formErrors.email && (
                                <p className="text-red-500 text-sm mt-1">
                                    {formErrors.email}
                                </p>
                            )}
                        </div>
                        <div>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Password"
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                                    formErrors.password
                                        ? 'border-red-300 focus:ring-red-400'
                                        : 'border-gray-300 focus:ring-blue-950'
                                }`}
                                disabled={loginLoading}
                            />
                            {formErrors.password && (
                                <p className="text-red-500 text-sm mt-1">
                                    {formErrors.password}
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={loginLoading}
                            className="w-full bg-blue-950 text-white py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loginLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Signing In...
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="flex items-center justify-center mt-6">
                        <UserPlus size={16} className="text-orange-400 mr-2" />
                        <span className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <button
                                onClick={() => navigate('/signup')}
                                className="text-orange-400 font-medium hover:text-orange-500 transition-colors"
                            >
                                Sign up
                            </button>
                        </span>
                    </div>
                </div>
            </div>

            {/* Full Screen Loading Overlay */}
            {isLoading && (
                <LoadingSpinner
                    fullScreen={true}
                    text="Authenticating..."
                    size="lg"
                    variant="pulse"
                />
            )}
        </>
    );
}

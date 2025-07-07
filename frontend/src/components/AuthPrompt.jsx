import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn, UserPlus } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthPrompt = ({
    isOpen,
    onClose,
    title = 'Authentication Required',
    message = 'Please sign in to continue',
}) => {
    const navigate = useNavigate();
    const { login, loginWithEmail, registerWithEmail, loginLoading } =
        useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState('options'); // 'options', 'login', 'signup'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const BASE_URL = 'http://localhost:3000';

    const handleGoogleLoginSuccess = async (credentialResponse) => {
        setIsLoading(true);
        try {
            const response = await axios.post(
                `${BASE_URL}/api/user/auth/google-login`,
                {
                    token: credentialResponse.credential,
                }
            );

            if (response.data.token) {
                const loginSuccess = await login(response.data.token);
                if (loginSuccess) {
                    onClose();
                    // Continue with the original action
                }
            } else {
                console.error('Login failed: No token received');
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

    const handleGoogleLoginError = () => {
        toast.error('Login was cancelled or failed. Please try again.');
    };

    const handleSignUpClick = () => {
        setMode('signup');
        setFormData({ name: '', email: '', password: '' });
        setFormErrors({});
    };

    const handleSignInClick = () => {
        setMode('login');
        setFormData({ name: '', email: '', password: '' });
        setFormErrors({});
    };

    const handleBackToOptions = () => {
        setMode('options');
        setFormData({ name: '', email: '', password: '' });
        setFormErrors({});
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
    const validateForm = (isSignup = false) => {
        const errors = {};

        if (isSignup && !formData.name.trim()) {
            errors.name = 'Name is required';
        } else if (isSignup && formData.name.trim().length > 100) {
            errors.name = 'Name must be less than 100 characters';
        }

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
        } else if (isSignup && formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        return errors;
    };

    // Handle traditional email/password login
    const handleEmailLogin = async (e) => {
        e.preventDefault();

        const errors = validateForm(false);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const success = await loginWithEmail(
            formData.email.trim(),
            formData.password
        );

        if (success) {
            onClose();
        }
    };

    // Handle traditional email/password signup
    const handleEmailSignUp = async (e) => {
        e.preventDefault();

        const errors = validateForm(true);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const success = await registerWithEmail(
            formData.name.trim(),
            formData.email.trim(),
            formData.password
        );

        if (success) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>

                    {/* Content */}
                    {mode === 'options' && (
                        <>
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-950 to-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <LogIn size={24} className="text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {title}
                                </h2>
                                <p className="text-gray-600">{message}</p>
                            </div>

                            {/* Google Login */}
                            <div className="mb-4 relative flex justify-center items-center w-full">
                                {isLoading && (
                                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-md z-10">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-950"></div>
                                    </div>
                                )}
                                <GoogleLogin
                                    onSuccess={handleGoogleLoginSuccess}
                                    onError={handleGoogleLoginError}
                                    theme="outline"
                                    size="large"
                                    width="100%"
                                    disabled={isLoading || loginLoading}
                                />
                            </div>

                            {/* Divider */}
                            <div className="flex items-center my-4">
                                <div className="flex-1 border-t border-gray-300"></div>
                                <span className="px-3 text-sm text-gray-500">
                                    or
                                </span>
                                <div className="flex-1 border-t border-gray-300"></div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={handleSignInClick}
                                    className="w-full py-3 bg-blue-950 hover:bg-blue-800 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                    disabled={loginLoading}
                                >
                                    <LogIn size={18} />
                                    Sign In
                                </button>

                                <button
                                    onClick={handleSignUpClick}
                                    className="w-full py-3 bg-orange-400 hover:bg-orange-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                    disabled={loginLoading}
                                >
                                    <UserPlus size={18} />
                                    Create Account
                                </button>
                            </div>
                        </>
                    )}

                    {/* Login Form */}
                    {mode === 'login' && (
                        <>
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-950 to-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <LogIn size={24} className="text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Welcome Back
                                </h2>
                                <p className="text-gray-600">
                                    Sign in to continue
                                </p>
                            </div>

                            {/* Google Login */}
                            <div className="mb-4 relative flex justify-center items-center w-full">
                                {isLoading && (
                                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-md z-10">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-950"></div>
                                    </div>
                                )}
                                <GoogleLogin
                                    onSuccess={handleGoogleLoginSuccess}
                                    onError={handleGoogleLoginError}
                                    theme="outline"
                                    size="large"
                                    width="100%"
                                    disabled={isLoading || loginLoading}
                                />
                            </div>

                            {/* Divider */}
                            <div className="flex items-center my-4">
                                <div className="flex-1 border-t border-gray-300"></div>
                                <span className="px-3 text-sm text-gray-500">
                                    or
                                </span>
                                <div className="flex-1 border-t border-gray-300"></div>
                            </div>

                            {/* Email Form */}
                            <form
                                className="space-y-4"
                                onSubmit={handleEmailLogin}
                            >
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

                            {/* Back Button */}
                            <button
                                onClick={handleBackToOptions}
                                className="w-full mt-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                disabled={loginLoading}
                            >
                                ← Back to options
                            </button>
                        </>
                    )}

                    {/* Signup Form */}
                    {mode === 'signup' && (
                        <>
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <UserPlus
                                        size={24}
                                        className="text-white"
                                    />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Join KhodKquiz
                                </h2>
                                <p className="text-gray-600">
                                    Create your account and start learning
                                </p>
                            </div>

                            {/* Google Login */}
                            <div className="mb-4 relative flex justify-center items-center w-full">
                                {isLoading && (
                                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-md z-10">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-400"></div>
                                    </div>
                                )}
                                <GoogleLogin
                                    onSuccess={handleGoogleLoginSuccess}
                                    onError={handleGoogleLoginError}
                                    theme="outline"
                                    size="large"
                                    width="100%"
                                    disabled={isLoading || loginLoading}
                                />
                            </div>

                            {/* Divider */}
                            <div className="flex items-center my-4">
                                <div className="flex-1 border-t border-gray-300"></div>
                                <span className="px-3 text-sm text-gray-500">
                                    or
                                </span>
                                <div className="flex-1 border-t border-gray-300"></div>
                            </div>

                            {/* Email Form */}
                            <form
                                className="space-y-4"
                                onSubmit={handleEmailSignUp}
                            >
                                <div>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Full name"
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                                            formErrors.name
                                                ? 'border-red-300 focus:ring-red-400'
                                                : 'border-gray-300 focus:ring-orange-400'
                                        }`}
                                        disabled={loginLoading}
                                    />
                                    {formErrors.name && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {formErrors.name}
                                        </p>
                                    )}
                                </div>
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
                                                : 'border-gray-300 focus:ring-orange-400'
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
                                        placeholder="Password (min. 6 characters)"
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                                            formErrors.password
                                                ? 'border-red-300 focus:ring-red-400'
                                                : 'border-gray-300 focus:ring-orange-400'
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
                                    className="w-full bg-orange-400 text-white py-3 rounded-lg font-medium hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loginLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Creating Account...
                                        </div>
                                    ) : (
                                        'Create Account'
                                    )}
                                </button>
                            </form>

                            {/* Back Button */}
                            <button
                                onClick={handleBackToOptions}
                                className="w-full mt-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                disabled={loginLoading}
                            >
                                ← Back to options
                            </button>
                        </>
                    )}

                    {/* Footer */}
                    <p className="text-xs text-gray-500 text-center mt-4">
                        By continuing, you agree to our Terms of Service and
                        Privacy Policy.
                    </p>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AuthPrompt;

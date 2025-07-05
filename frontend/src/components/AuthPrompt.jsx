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
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
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
        onClose();
        navigate('/signup');
    };

    const handleSignInClick = () => {
        onClose();
        navigate('/login');
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
                            disabled={isLoading}
                        />
                    </div>

                    {/* Divider */}
                    <div className="flex items-center my-4">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="px-3 text-sm text-gray-500">or</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={handleSignInClick}
                            className="w-full py-3 bg-blue-950 hover:bg-blue-800 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <LogIn size={18} />
                            Sign In
                        </button>

                        <button
                            onClick={handleSignUpClick}
                            className="w-full py-3 bg-orange-400 hover:bg-orange-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <UserPlus size={18} />
                            Create Account
                        </button>
                    </div>

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

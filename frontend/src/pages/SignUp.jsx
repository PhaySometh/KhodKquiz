import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar/NavBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus, LogIn } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = 'http://localhost:3000';

export default function SignUp() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    // Get the intended destination from location state, default to dashboard
    const from = location.state?.from?.pathname || '/';

    const handleSignUpSuccess = async (credentialResponse) => {
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
                const loginSuccess = await login(response.data.token, false); // Don't show welcome toast for signup
                if (loginSuccess) {
                    toast.success(
                        'Account created successfully! Welcome to KhodKquiz!',
                        {
                            icon: '🎉',
                            duration: 4000,
                        }
                    );
                    // Redirect to intended destination or dashboard
                    navigate(from, { replace: true });
                }
            } else {
                console.error(
                    'Sign up failed: No token received:',
                    response.data.error
                );
                toast.error('Sign up failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during Google sign up:', error);
            toast.error(
                'Sign up failed. Please check your connection and try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUpError = () => {
        toast.error('Sign up was cancelled or failed. Please try again.');
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
                        <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <UserPlus size={24} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Join KhodKquiz
                        </h2>
                        <p className="text-gray-600">
                            Create your account and start learning
                        </p>
                    </div>

                    {/* Google Login */}
                    <div className="mb-6 relative flex justify-center items-center w-full">
                        {isLoading && (
                            <div className="absolute inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center rounded-md z-10">
                                <LoadingSpinner
                                    size="md"
                                    text="Creating your account..."
                                    variant="writing"
                                />
                            </div>
                        )}
                        <GoogleLogin
                            onSuccess={handleSignUpSuccess}
                            onError={handleSignUpError}
                            theme="outline"
                            size="large"
                            width="100%"
                            disabled={isLoading}
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
                    <form className="space-y-4">
                        <input
                            type="text"
                            placeholder="Full name"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                        />
                        <input
                            type="email"
                            placeholder="Email address"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                        />
                        <button
                            type="button"
                            className="w-full bg-orange-400 text-white py-3 rounded-lg font-medium hover:bg-orange-500 transition-colors"
                        >
                            Create Account
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="flex items-center justify-center mt-6">
                        <LogIn size={16} className="text-blue-950 mr-2" />
                        <span className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="text-blue-950 font-medium hover:text-blue-800 transition-colors"
                            >
                                Sign in
                            </button>
                        </span>
                    </div>
                </div>
            </div>

            {/* Full Screen Loading Overlay */}
            {isLoading && (
                <LoadingSpinner
                    fullScreen={true}
                    text="Setting up your account..."
                    size="lg"
                    variant="pulse"
                />
            )}
        </>
    );
}

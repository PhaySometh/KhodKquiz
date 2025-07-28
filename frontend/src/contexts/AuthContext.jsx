import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import apiClient from '../utils/axiosConfig';

// Create authentication context for managing user state across the app
const AuthContext = createContext();

/**
 * Custom hook to access authentication context
 * Must be used within AuthProvider component
 * @returns {Object} Authentication context with user data and methods
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

/**
 * Authentication Provider Component
 * Manages user authentication state, login/logout, and profile updates
 * Provides authentication context to child components
 */
export const AuthProvider = ({ children }) => {
    // Authentication state variables
    const [user, setUser] = useState(null); // Current user data (name, email, picture, etc.)
    const [loading, setLoading] = useState(true); // Loading state during auth checks
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication status
    const [loginLoading, setLoginLoading] = useState(false); // Loading state for login operations
    const [logoutLoading, setLogoutLoading] = useState(false); // Loading state for logout operations

    const BASE_URL = 'http://localhost:3000';

    // Auto-refresh token every 50 minutes (tokens expire in 1 hour)
    // This prevents unexpected logouts due to token expiration
    useEffect(() => {
        if (isAuthenticated) {
            const interval = setInterval(() => {
                checkAuthStatus();
            }, 50 * 60 * 1000); // 50 minutes

            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    // Check authentication status when app loads
    useEffect(() => {
        checkAuthStatus();
    }, []);

    /**
     * Get the appropriate redirect path based on user role
     * @param {string} role - User's role (admin, teacher, student)
     * @param {string} intendedPath - Originally intended path (optional)
     * @returns {string} - Redirect path
     */
    const getRoleBasedRedirectPath = (role, intendedPath = null) => {
        // If there's an intended path and it's accessible to the user's role, use it
        if (
            intendedPath &&
            intendedPath !== '/login' &&
            intendedPath !== '/signup'
        ) {
            // Check if the intended path matches the user's role
            if (role === 'admin' && intendedPath.startsWith('/admin')) {
                return intendedPath;
            }
            if (role === 'teacher' && intendedPath.startsWith('/teacher')) {
                return intendedPath;
            }
            if (role === 'student' && intendedPath.startsWith('/student')) {
                return intendedPath;
            }
        }

        // Default role-based redirects
        switch (role) {
            case 'admin':
                return '/admin';
            case 'teacher':
                return '/teacher';
            case 'student':
                return '/quiz/category'; // Students go to quiz categories
            default:
                return '/quiz/category';
        }
    };

    /**
     * Verifies if the current user token is valid
     * Called on app load and periodically to refresh authentication
     * Handles token expiration and invalid tokens gracefully
     */
    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                setLoading(false);
                return;
            }

            // Use apiClient which automatically adds auth headers
            const response = await apiClient.get('/api/user');

            if (response.data) {
                setUser(response.data);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            // Clear invalid token from storage
            localStorage.removeItem('userToken');
            setUser(null);
            setIsAuthenticated(false);

            // Show user-friendly message only for token expiration
            if (error.response?.status === 401) {
                toast.error('Session expired. Please log in again.', {
                    icon: '⏰',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handles user login with JWT token
     * @param {string} token - JWT token received from Google OAuth or traditional auth
     * @param {boolean} showSuccessToast - Whether to show welcome toast (default: true)
     * @returns {boolean} - Success status of login attempt
     */
    const login = async (token, showSuccessToast = true) => {
        try {
            // Store token in localStorage for persistence
            localStorage.setItem('userToken', token);

            // Fetch user data using the token
            const response = await apiClient.get('/api/user');

            if (response.data) {
                setUser(response.data);
                setIsAuthenticated(true);

                // Show welcome message unless explicitly disabled (e.g., for signup)
                if (showSuccessToast) {
                    toast.success(`Welcome back, ${response.data.name}!`, {
                        icon: '👋',
                    });
                }

                return true;
            }
        } catch (error) {
            console.error('Login failed:', error);
            // Clean up on failure
            localStorage.removeItem('userToken');
            toast.error('Login failed. Please try again.');
            return false;
        }
    };

    /**
     * Handles traditional email/password login
     * @param {string} email - User's email address
     * @param {string} password - User's password
     * @param {boolean} showSuccessToast - Whether to show welcome toast (default: true)
     * @returns {boolean} - Success status of login attempt
     */
    const loginWithEmail = async (email, password, showSuccessToast = true) => {
        setLoginLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/api/user/login`, {
                email,
                password,
            });

            if (response.data.token) {
                const loginSuccess = await login(
                    response.data.token,
                    showSuccessToast
                );
                return loginSuccess;
            }
            return false;
        } catch (error) {
            console.error('Email login failed:', error);
            const errorMessage =
                error.response?.data?.error ||
                'Login failed. Please try again.';
            toast.error(errorMessage);
            return false;
        } finally {
            setLoginLoading(false);
        }
    };

    /**
     * Handles traditional email/password registration
     * @param {string} name - User's full name
     * @param {string} email - User's email address
     * @param {string} password - User's password
     * @returns {boolean} - Success status of registration attempt
     */
    const registerWithEmail = async (name, email, password) => {
        setLoginLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/api/user/register`, {
                name,
                email,
                password,
            });

            if (response.data.token) {
                const loginSuccess = await login(response.data.token, false); // Don't show welcome toast for registration
                if (loginSuccess) {
                    toast.success(
                        'Account created successfully! Welcome to KhodKquiz!',
                        {
                            icon: '🎉',
                            duration: 4000,
                        }
                    );
                }
                return loginSuccess;
            }
            return false;
        } catch (error) {
            console.error('Email registration failed:', error);

            // Handle validation errors
            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                Object.values(errors).forEach((errorMsg) => {
                    toast.error(errorMsg);
                });
            } else {
                const errorMessage =
                    error.response?.data?.error ||
                    'Registration failed. Please try again.';
                toast.error(errorMessage);
            }
            return false;
        } finally {
            setLoginLoading(false);
        }
    };

    const logout = async () => {
        setLogoutLoading(true);
        try {
            // Add a brief delay for better UX
            await new Promise((resolve) => setTimeout(resolve, 800));

            // Clear all authentication tokens
            localStorage.removeItem('userToken');
            localStorage.removeItem('adminToken');

            // Reset authentication state
            setUser(null);
            setIsAuthenticated(false);

            toast.success('Logged out successfully', {
                icon: '👋',
            });
        } finally {
            setLogoutLoading(false);
        }
    };

    /**
     * Switch between admin and regular user accounts
     * Allows seamless switching without full logout/login cycle
     */
    const switchAccount = async (targetRole) => {
        setLoading(true);
        try {
            if (targetRole === 'admin') {
                // Switch to admin account
                const adminToken = localStorage.getItem('adminToken');
                if (adminToken) {
                    // Check if admin token is valid
                    const response = await fetch(`${BASE_URL}/api/user`, {
                        headers: {
                            Authorization: `Bearer ${adminToken}`,
                        },
                    });

                    if (response.ok) {
                        const userData = await response.json();
                        setUser(userData);
                        setIsAuthenticated(true);
                        toast.success('Switched to admin account', {
                            icon: '👑',
                        });
                        return '/admin';
                    }
                }
                toast.error('Admin access not available');
                return null;
            } else {
                // Switch to regular user account
                const userToken = localStorage.getItem('userToken');
                if (userToken) {
                    // Check if user token is valid
                    const response = await fetch(`${BASE_URL}/api/user`, {
                        headers: {
                            Authorization: `Bearer ${userToken}`,
                        },
                    });

                    if (response.ok) {
                        const userData = await response.json();
                        setUser(userData);
                        setIsAuthenticated(true);
                        toast.success('Switched to user account', {
                            icon: '👤',
                        });
                        return getRoleBasedRedirectPath(userData.role);
                    }
                }
                toast.error('User access not available');
                return null;
            }
        } catch (error) {
            console.error('Account switch error:', error);
            toast.error('Failed to switch accounts');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (profileData) => {
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                toast.error('Authentication required');
                return false;
            }

            const response = await apiClient.put(
                '/api/user/profile',
                profileData
            );

            if (response.data) {
                setUser(response.data);

                // Update localStorage with new user data
                localStorage.setItem('user', JSON.stringify(response.data));

                toast.success('Profile updated successfully!', {
                    icon: '✅',
                });
                return true;
            }
        } catch (error) {
            console.error('Profile update failed:', error);
            const errorMessage =
                error.response?.data?.error || 'Failed to update profile';
            toast.error(errorMessage);
            return false;
        }
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        loginLoading,
        logoutLoading,
        login,
        loginWithEmail,
        registerWithEmail,
        logout,
        switchAccount,
        updateProfile,
        checkAuthStatus,
        getRoleBasedRedirectPath,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

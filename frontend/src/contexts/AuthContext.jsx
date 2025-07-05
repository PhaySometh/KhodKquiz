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
     * @param {string} token - JWT token received from Google OAuth
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

    const logout = async () => {
        setLogoutLoading(true);
        try {
            // Add a brief delay for better UX
            await new Promise((resolve) => setTimeout(resolve, 800));

            localStorage.removeItem('userToken');
            setUser(null);
            setIsAuthenticated(false);
            toast.success('Logged out successfully', {
                icon: '👋',
            });
        } finally {
            setLogoutLoading(false);
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
        logout,
        updateProfile,
        checkAuthStatus,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = 'http://localhost:3000';

// Create axios instance
const apiClient = axios.create({
    baseURL: BASE_URL,
});

// Request interceptor to add auth token
// Automatically attaches the saved JWT token (userToken) from localStorage in the Authorization header of every request
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token expiration
// Intercepts responses globally to detect when a token expires (HTTP 401), clear it from localStorage, show a toast notification, and redirect the user to /login.
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('userToken');
            
            // Show toast notification
            toast.error('Session expired. Please log in again.', {
                icon: '⏰',
                duration: 5000,
            });
            
            // Redirect to login page
            window.location.href = '/login';
        }
        
        return Promise.reject(error);
    }
);

export default apiClient;

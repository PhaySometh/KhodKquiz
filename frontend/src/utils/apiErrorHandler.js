import toast from 'react-hot-toast';

/**
 * Utility functions for consistent API error handling across the application
 * Provides standardized error messages and user feedback
 */

/**
 * Extracts error message from API response
 * @param {Object} error - Error object from API call
 * @returns {string} User-friendly error message
 */
export const extractErrorMessage = (error) => {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }
    
    if (error.response?.data?.error) {
        return error.response.data.error;
    }
    
    if (error.message) {
        return error.message;
    }
    
    return 'An unexpected error occurred. Please try again.';
};

/**
 * Handles API errors with consistent user feedback
 * @param {Object} error - Error object from API call
 * @param {string} defaultMessage - Default message if no specific error found
 * @param {boolean} showToast - Whether to show toast notification
 * @returns {string} Error message that was displayed/returned
 */
export const handleApiError = (error, defaultMessage = 'Operation failed', showToast = true) => {
    const errorMessage = extractErrorMessage(error);
    
    if (showToast) {
        toast.error(errorMessage);
    }
    
    // Log error for debugging in development
    if (process.env.NODE_ENV === 'development') {
        console.error('API Error:', error);
    }
    
    return errorMessage;
};

/**
 * Handles successful API responses with optional success message
 * @param {Object} response - Successful API response
 * @param {string} successMessage - Message to show on success
 * @param {boolean} showToast - Whether to show toast notification
 * @returns {any} Response data
 */
export const handleApiSuccess = (response, successMessage = null, showToast = true) => {
    if (successMessage && showToast) {
        toast.success(successMessage);
    }
    
    return response.data;
};

/**
 * Creates a standardized error handler function for async operations
 * @param {string} operationName - Name of the operation for error context
 * @param {function} onError - Optional callback for additional error handling
 * @returns {function} Error handler function
 */
export const createErrorHandler = (operationName, onError = null) => {
    return (error) => {
        const errorMessage = handleApiError(error, `Failed to ${operationName}`);
        
        if (onError && typeof onError === 'function') {
            onError(error, errorMessage);
        }
        
        return errorMessage;
    };
};

/**
 * Wraps async API calls with consistent error handling
 * @param {function} apiCall - Async function that makes the API call
 * @param {string} operationName - Name of the operation for error context
 * @param {Object} options - Options for error handling
 * @returns {Promise} Promise that resolves with data or rejects with handled error
 */
export const withErrorHandling = async (apiCall, operationName, options = {}) => {
    const {
        showErrorToast = true,
        showSuccessToast = false,
        successMessage = null,
        onError = null,
        onSuccess = null
    } = options;
    
    try {
        const response = await apiCall();
        
        if (onSuccess && typeof onSuccess === 'function') {
            onSuccess(response);
        }
        
        return handleApiSuccess(response, successMessage, showSuccessToast);
        
    } catch (error) {
        const errorMessage = handleApiError(error, `Failed to ${operationName}`, showErrorToast);
        
        if (onError && typeof onError === 'function') {
            onError(error, errorMessage);
        }
        
        throw new Error(errorMessage);
    }
};

/**
 * HTTP status code constants for better error handling
 */
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
};

/**
 * Checks if error is of specific HTTP status
 * @param {Object} error - Error object
 * @param {number} statusCode - HTTP status code to check
 * @returns {boolean} Whether error matches the status code
 */
export const isHttpError = (error, statusCode) => {
    return error.response?.status === statusCode;
};

/**
 * Gets user-friendly message based on HTTP status code
 * @param {number} statusCode - HTTP status code
 * @returns {string} User-friendly error message
 */
export const getStatusMessage = (statusCode) => {
    const statusMessages = {
        [HTTP_STATUS.BAD_REQUEST]: 'Invalid request. Please check your input.',
        [HTTP_STATUS.UNAUTHORIZED]: 'Please log in to continue.',
        [HTTP_STATUS.FORBIDDEN]: 'You do not have permission to perform this action.',
        [HTTP_STATUS.NOT_FOUND]: 'The requested resource was not found.',
        [HTTP_STATUS.CONFLICT]: 'This action conflicts with existing data.',
        [HTTP_STATUS.INTERNAL_SERVER_ERROR]: 'Server error. Please try again later.'
    };
    
    return statusMessages[statusCode] || 'An unexpected error occurred.';
};

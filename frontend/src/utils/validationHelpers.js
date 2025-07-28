/**
 * Utility functions for form validation and data validation
 * Provides reusable validation logic following clean code principles
 */

/**
 * Validates email format using regex
 * @param {string} email - Email address to validate
 * @returns {boolean} Whether email is valid
 */
export const isValidEmail = (email) => {
    if (!email || typeof email !== 'string') return false;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and errors
 */
export const validatePassword = (password) => {
    const errors = [];
    
    if (!password || typeof password !== 'string') {
        return { isValid: false, errors: ['Password is required'] };
    }
    
    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Validates required fields in an object
 * @param {Object} data - Data object to validate
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} Validation result with isValid and missing fields
 */
export const validateRequiredFields = (data, requiredFields) => {
    const missingFields = [];
    
    requiredFields.forEach(fieldName => {
        const value = data[fieldName];
        
        if (value === undefined || value === null || value === '') {
            missingFields.push(fieldName);
        }
    });
    
    return {
        isValid: missingFields.length === 0,
        missingFields
    };
};

/**
 * Validates string length constraints
 * @param {string} value - String to validate
 * @param {number} minLength - Minimum length (optional)
 * @param {number} maxLength - Maximum length (optional)
 * @returns {Object} Validation result
 */
export const validateStringLength = (value, minLength = null, maxLength = null) => {
    const errors = [];
    
    if (typeof value !== 'string') {
        return { isValid: false, errors: ['Value must be a string'] };
    }
    
    const trimmedValue = value.trim();
    
    if (minLength !== null && trimmedValue.length < minLength) {
        errors.push(`Must be at least ${minLength} characters long`);
    }
    
    if (maxLength !== null && trimmedValue.length > maxLength) {
        errors.push(`Must be no more than ${maxLength} characters long`);
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Validates numeric values within a range
 * @param {number} value - Number to validate
 * @param {number} min - Minimum value (optional)
 * @param {number} max - Maximum value (optional)
 * @returns {Object} Validation result
 */
export const validateNumberRange = (value, min = null, max = null) => {
    const errors = [];
    
    if (typeof value !== 'number' || isNaN(value)) {
        return { isValid: false, errors: ['Value must be a valid number'] };
    }
    
    if (min !== null && value < min) {
        errors.push(`Must be at least ${min}`);
    }
    
    if (max !== null && value > max) {
        errors.push(`Must be no more than ${max}`);
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Validates array constraints
 * @param {Array} array - Array to validate
 * @param {number} minLength - Minimum array length (optional)
 * @param {number} maxLength - Maximum array length (optional)
 * @returns {Object} Validation result
 */
export const validateArrayLength = (array, minLength = null, maxLength = null) => {
    const errors = [];
    
    if (!Array.isArray(array)) {
        return { isValid: false, errors: ['Value must be an array'] };
    }
    
    if (minLength !== null && array.length < minLength) {
        errors.push(`Must contain at least ${minLength} items`);
    }
    
    if (maxLength !== null && array.length > maxLength) {
        errors.push(`Must contain no more than ${maxLength} items`);
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Sanitizes string input by trimming and removing dangerous characters
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeString = (input) => {
    if (typeof input !== 'string') return '';
    
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, ''); // Remove event handlers
};

/**
 * Validates file upload constraints
 * @param {File} file - File object to validate
 * @param {Array} allowedTypes - Array of allowed MIME types
 * @param {number} maxSizeBytes - Maximum file size in bytes
 * @returns {Object} Validation result
 */
export const validateFileUpload = (file, allowedTypes = [], maxSizeBytes = null) => {
    const errors = [];
    
    if (!file || !(file instanceof File)) {
        return { isValid: false, errors: ['Please select a valid file'] };
    }
    
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
        errors.push(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }
    
    if (maxSizeBytes && file.size > maxSizeBytes) {
        const maxSizeMB = (maxSizeBytes / (1024 * 1024)).toFixed(1);
        errors.push(`File size must be less than ${maxSizeMB}MB`);
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Creates a validation schema for complex objects
 * @param {Object} schema - Validation schema definition
 * @returns {function} Validation function
 */
export const createValidationSchema = (schema) => {
    return (data) => {
        const errors = {};
        let isValid = true;
        
        Object.keys(schema).forEach(fieldName => {
            const fieldSchema = schema[fieldName];
            const fieldValue = data[fieldName];
            const fieldErrors = [];
            
            // Check if field is required
            if (fieldSchema.required && (fieldValue === undefined || fieldValue === null || fieldValue === '')) {
                fieldErrors.push(`${fieldName} is required`);
                isValid = false;
            }
            
            // Run custom validators if field has value
            if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
                if (fieldSchema.validators) {
                    fieldSchema.validators.forEach(validator => {
                        const result = validator(fieldValue);
                        if (!result.isValid) {
                            fieldErrors.push(...result.errors);
                            isValid = false;
                        }
                    });
                }
            }
            
            if (fieldErrors.length > 0) {
                errors[fieldName] = fieldErrors;
            }
        });
        
        return {
            isValid,
            errors
        };
    };
};

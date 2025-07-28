/**
 * Admin Form Validation Utilities
 * 
 * Comprehensive validation functions for admin interface forms
 */

/**
 * Validate user creation/update form
 */
export const validateUserForm = (userData) => {
    const errors = {};

    // Name validation
    if (!userData.name || userData.name.trim().length === 0) {
        errors.name = 'Name is required';
    } else if (userData.name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters long';
    } else if (userData.name.trim().length > 100) {
        errors.name = 'Name must be less than 100 characters';
    }

    // Email validation
    if (!userData.email || userData.email.trim().length === 0) {
        errors.email = 'Email is required';
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email.trim())) {
            errors.email = 'Please enter a valid email address';
        }
    }

    // Password validation (only for new users or when password is provided)
    if (userData.password !== undefined) {
        if (!userData.password || userData.password.length === 0) {
            errors.password = 'Password is required';
        } else if (userData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters long';
        } else if (userData.password.length > 128) {
            errors.password = 'Password must be less than 128 characters';
        }
    }

    // Role validation
    if (!userData.role) {
        errors.role = 'Role is required';
    } else if (!['student', 'teacher', 'admin'].includes(userData.role)) {
        errors.role = 'Invalid role selected';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Validate quiz creation/update form
 */
export const validateQuizForm = (quizData) => {
    const errors = {};

    // Title validation
    if (!quizData.title || quizData.title.trim().length === 0) {
        errors.title = 'Quiz title is required';
    } else if (quizData.title.trim().length < 3) {
        errors.title = 'Quiz title must be at least 3 characters long';
    } else if (quizData.title.trim().length > 150) {
        errors.title = 'Quiz title must be less than 150 characters';
    }

    // Description validation
    if (quizData.description && quizData.description.length > 1000) {
        errors.description = 'Description must be less than 1000 characters';
    }

    // Category validation
    if (!quizData.category) {
        errors.category = 'Category is required';
    }

    // Difficulty validation
    if (!quizData.difficulty) {
        errors.difficulty = 'Difficulty level is required';
    } else if (!['easy', 'medium', 'hard'].includes(quizData.difficulty)) {
        errors.difficulty = 'Invalid difficulty level';
    }

    // Time validation
    if (!quizData.time) {
        errors.time = 'Time limit is required';
    } else {
        const timeNum = parseInt(quizData.time);
        if (isNaN(timeNum) || timeNum < 1) {
            errors.time = 'Time limit must be at least 1 minute';
        } else if (timeNum > 180) {
            errors.time = 'Time limit cannot exceed 180 minutes';
        }
    }

    // Questions validation
    if (!quizData.questions || quizData.questions.length === 0) {
        errors.questions = 'At least one question is required';
    } else {
        const questionErrors = [];
        quizData.questions.forEach((question, index) => {
            const questionError = validateQuizQuestion(question, index + 1);
            if (!questionError.isValid) {
                questionErrors.push(questionError);
            }
        });
        
        if (questionErrors.length > 0) {
            errors.questions = questionErrors;
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Validate individual quiz question
 */
export const validateQuizQuestion = (question, questionNumber) => {
    const errors = {};

    // Question text validation
    if (!question.question || question.question.trim().length === 0) {
        errors.question = `Question ${questionNumber}: Question text is required`;
    } else if (question.question.trim().length < 5) {
        errors.question = `Question ${questionNumber}: Question text must be at least 5 characters long`;
    }

    // Options validation
    if (!question.options || question.options.length === 0) {
        errors.options = `Question ${questionNumber}: Options are required`;
    } else {
        const validOptions = question.options.filter(opt => opt && opt.trim().length > 0);
        if (validOptions.length < 2) {
            errors.options = `Question ${questionNumber}: At least 2 options are required`;
        }

        // Check for duplicate options
        const uniqueOptions = new Set(validOptions.map(opt => opt.trim().toLowerCase()));
        if (uniqueOptions.size !== validOptions.length) {
            errors.options = `Question ${questionNumber}: Options must be unique`;
        }
    }

    // Correct answer validation
    if (question.correctAnswer === null || question.correctAnswer === undefined) {
        errors.correctAnswer = `Question ${questionNumber}: Correct answer must be selected`;
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Validate category form
 */
export const validateCategoryForm = (categoryData) => {
    const errors = {};

    // Name validation
    if (!categoryData.name || categoryData.name.trim().length === 0) {
        errors.name = 'Category name is required';
    } else if (categoryData.name.trim().length < 2) {
        errors.name = 'Category name must be at least 2 characters long';
    } else if (categoryData.name.trim().length > 100) {
        errors.name = 'Category name must be less than 100 characters';
    }

    // Description validation
    if (categoryData.description && categoryData.description.length > 500) {
        errors.description = 'Description must be less than 500 characters';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Validate teacher application review form
 */
export const validateTeacherApplicationReview = (reviewData) => {
    const errors = {};

    // Action validation
    if (!reviewData.action) {
        errors.action = 'Review action is required';
    } else if (!['approve', 'reject'].includes(reviewData.action)) {
        errors.action = 'Invalid review action';
    }

    // Admin notes validation (optional but if provided, should be reasonable length)
    if (reviewData.adminNotes && reviewData.adminNotes.length > 1000) {
        errors.adminNotes = 'Admin notes must be less than 1000 characters';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * General purpose field validators
 */
export const validators = {
    required: (value, fieldName) => {
        if (!value || (typeof value === 'string' && value.trim().length === 0)) {
            return `${fieldName} is required`;
        }
        return null;
    },

    minLength: (value, min, fieldName) => {
        if (value && value.length < min) {
            return `${fieldName} must be at least ${min} characters long`;
        }
        return null;
    },

    maxLength: (value, max, fieldName) => {
        if (value && value.length > max) {
            return `${fieldName} must be less than ${max} characters`;
        }
        return null;
    },

    email: (value) => {
        if (value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return 'Please enter a valid email address';
            }
        }
        return null;
    },

    number: (value, fieldName) => {
        if (value && isNaN(Number(value))) {
            return `${fieldName} must be a valid number`;
        }
        return null;
    },

    positiveNumber: (value, fieldName) => {
        if (value && (isNaN(Number(value)) || Number(value) <= 0)) {
            return `${fieldName} must be a positive number`;
        }
        return null;
    }
};

/**
 * Utility function to display validation errors
 */
export const formatValidationErrors = (errors) => {
    if (typeof errors === 'string') {
        return errors;
    }

    if (Array.isArray(errors)) {
        return errors.map(error => error.errors ? Object.values(error.errors).join(', ') : error).join('; ');
    }

    if (typeof errors === 'object') {
        return Object.values(errors).flat().join(', ');
    }

    return 'Validation failed';
};

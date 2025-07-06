/**
 * Middleware for validating user registration input
 */
export const validateRegistration = (req, res, next) => {
    const { name, email, password } = req.body;
    const errors = {};

    // Validate name
    if (!name || name.trim() === '') {
        errors.name = 'Name is required';
    } else if (name.trim().length > 100) {
        errors.name = 'Name must be less than 100 characters';
    }

    // Validate email
    if (!email || email.trim() === '') {
        errors.email = 'Email is required';
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.email = 'Invalid email format';
        }
    }

    // Validate password
    if (!password) {
        errors.password = 'Password is required';
    } else if (password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    }

    // If there are errors, return them
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

/**
 * Middleware for validating login input
 */
export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = {};

    // Validate email
    if (!email || email.trim() === '') {
        errors.email = 'Email is required';
    }

    // Validate password
    if (!password) {
        errors.password = 'Password is required';
    }

    // If there are errors, return them
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

/**
 * Middleware for validating profile update input
 */
export const validateProfileUpdate = (req, res, next) => {
    const { name } = req.body;
    
    if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'Name is required' });
    }
    
    if (name.trim().length > 100) {
        return res.status(400).json({ error: 'Name must be less than 100 characters' });
    }
    
    next();
};
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
 * Validates optional fields (name, picture) when provided
 */
export const validateProfileUpdate = (req, res, next) => {
    const { name, picture } = req.body;

    // Validate name if provided
    if (name !== undefined) {
        if (name === null || name === '' || name.trim() === '') {
            return res.status(400).json({ error: 'Name cannot be empty' });
        }

        if (name.trim().length > 100) {
            return res
                .status(400)
                .json({ error: 'Name must be less than 100 characters' });
        }
    }

    // Validate picture if provided
    if (picture !== undefined && picture !== null && picture !== '') {
        if (!picture.startsWith('data:image/')) {
            return res.status(400).json({ error: 'Invalid image format' });
        }

        // Check image size (base64 is ~33% larger than original)
        const imageSizeBytes = (picture.length * 3) / 4;
        const maxSizeBytes = 5 * 1024 * 1024; // 5MB

        if (imageSizeBytes > maxSizeBytes) {
            return res
                .status(400)
                .json({ error: 'Image size must be less than 5MB' });
        }
    }

    // Check if at least one field is provided for update
    if (name === undefined && picture === undefined) {
        return res
            .status(400)
            .json({
                error: 'At least one field (name or picture) must be provided',
            });
    }

    next();
};

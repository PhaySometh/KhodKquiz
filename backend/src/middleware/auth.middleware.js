import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Middleware to authenticate user requests using JWT
 * Extracts token from Authorization header and verifies it
 */
export const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Use unified JWT secret for all users (student/teacher/admin)
        const decoded = jwt.verify(token, process.env.JWT_USER_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Authentication error:', error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }

        return res.status(401).json({ error: 'Authentication failed' });
    }
};

/**
 * Middleware to check if authenticated user has admin role
 * Must be used after authenticate middleware
 */
export const isAdmin = (req, res, next) => {
    try {
        if (req.user?.role === 'admin') {
            return next();
        }

        return res
            .status(403)
            .json({ error: 'Forbidden: Admin access required' });
    } catch (error) {
        console.error('Admin authorization error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

/**
 * Middleware to check if authenticated user has teacher role
 * Must be used after authenticate middleware
 */
export const isTeacher = (req, res, next) => {
    try {
        if (req.user?.role === 'teacher') {
            return next();
        }

        return res
            .status(403)
            .json({ error: 'Forbidden: Teacher access required' });
    } catch (error) {
        console.error('Teacher authorization error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

/**
 * Middleware to check if authenticated user has student role
 * Must be used after authenticate middleware
 */
export const isStudent = (req, res, next) => {
    try {
        if (req.user?.role === 'student') {
            return next();
        }

        return res
            .status(403)
            .json({ error: 'Forbidden: Student access required' });
    } catch (error) {
        console.error('Student authorization error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

/**
 * Middleware to check if authenticated user has teacher or admin role
 * Must be used after authenticate middleware
 */
export const isTeacherOrAdmin = (req, res, next) => {
    try {
        if (req.user?.role === 'teacher' || req.user?.role === 'admin') {
            return next();
        }

        return res
            .status(403)
            .json({ error: 'Forbidden: Teacher or Admin access required' });
    } catch (error) {
        console.error('Teacher/Admin authorization error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

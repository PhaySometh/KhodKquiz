import jwt from 'jsonwebtoken';
import model from '../models/index.js';
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
        const decoded = jwt.verify(token, process.env.JWT_USER_SECRET);

        // Store user info in request object for use in route handlers
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
export const isAdmin = async (req, res, next) => {
    try {
        const user = await model.User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.role !== 'admin') {
            return res
                .status(403)
                .json({ error: 'Forbidden: Admin access required' });
        }

        next();
    } catch (error) {
        console.error('Admin authorization error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

/**
 * Middleware to check if authenticated user has teacher role
 * Must be used after authenticate middleware
 */
export const isTeacher = async (req, res, next) => {
    try {
        const user = await model.User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.role !== 'teacher') {
            return res
                .status(403)
                .json({ error: 'Forbidden: Teacher access required' });
        }

        next();
    } catch (error) {
        console.error('Teacher authorization error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

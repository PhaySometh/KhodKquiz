import express from 'express';
import {
    getUsers,
    verifyUser,
    getUser,
    updateUserProfile,
    registerUser,
    loginUser,
} from '../controllers/client/user.controller.js';
import { authenticate, isAdmin } from '../middleware/auth.middleware.js';
import {
    validateRegistration,
    validateLogin,
    validateProfileUpdate,
} from '../middleware/validation.middleware.js';
import { dbConnectionMiddleware } from '../middleware/dbConnection.middleware.js';

const router = express.Router();

// Public routes
router.use(dbConnectionMiddleware);
router.post('/auth/google-login', verifyUser);

// Teacher Routes
router.post('/register', validateRegistration, registerUser);
router.post('/login', validateLogin, loginUser);

// Protected routes
router.get('/', authenticate, getUser);
router.put('/profile', authenticate, validateProfileUpdate, updateUserProfile);

// Admin routes
router.get('/all', authenticate, isAdmin, getUsers);

export default router;

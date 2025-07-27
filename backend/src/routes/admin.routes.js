/**
 * Admin Routes
 *
 * Routes for admin-only functionality including quiz and category management.
 * All routes require authentication and admin role.
 *
 * Note: Admin authentication is now handled through the unified User model
 * with admin role, not the separate Admin model.
 */

import express from 'express';
import {
    createQuiz,
    getQuizzes,
} from '../controllers/admin/quiz.controller.js';

import {
    createCategory,
    getSystemCategories,
    updateCategory,
    deleteCategory,
} from '../controllers/admin/category.controller.js';

import { authenticate, isAdmin } from '../middleware/auth.middleware.js';
import { dbConnectionMiddleware } from '../middleware/dbConnection.middleware.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(isAdmin);
router.use(dbConnectionMiddleware);

// Quiz management routes
router.post('/quiz', createQuiz);
router.get('/quiz', getQuizzes);

// Category management routes
router.post('/category', createCategory);
router.get('/category', getSystemCategories);
router.put('/category/:id', updateCategory);
router.delete('/category/:id', deleteCategory);

export default router;

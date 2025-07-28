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
    uploadCategoryIcon,
    handleUploadError,
} from '../middleware/fileUpload.js';
import {
    createQuiz,
    getQuizzes,
    updateQuiz,
    deleteQuiz,
    getQuizById,
    addQuestionsToQuiz,
    updateQuizQuestion,
    deleteQuizQuestion,
    bulkDeleteQuizzes,
    bulkReassignCategory,
    getQuizTemplates,
    exportQuiz,
    importQuiz,
} from '../controllers/admin/quiz.controller.js';

import {
    createCategory,
    getSystemCategories,
    updateCategory,
    deleteCategory,
} from '../controllers/admin/category.controller.js';

import {
    getAllUsers,
    getUserStatistics,
    updateUserRole,
    getUserById,
    deleteUser,
    createUser,
} from '../controllers/admin/user.controller.js';

import {
    getDashboardStats,
    getQuizAnalytics,
    getUserEngagementAnalytics,
} from '../controllers/admin/analytics.controller.js';

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

// Templates and import/export routes (must come before :id routes)
router.get('/quiz/templates', getQuizTemplates);
router.post('/quiz/import', importQuiz);

// Bulk operations routes (must come before :id routes)
router.post('/quiz/bulk-delete', bulkDeleteQuizzes);
router.post('/quiz/bulk-reassign-category', bulkReassignCategory);

// Specific quiz routes (with :id parameter)
router.get('/quiz/:id', getQuizById);
router.put('/quiz/:id', updateQuiz);
router.delete('/quiz/:id', deleteQuiz);
router.get('/quiz/:id/export', exportQuiz);

// Enhanced quiz question management routes
router.post('/quiz/:id/questions', addQuestionsToQuiz);
router.put('/quiz/:id/questions/:questionId', updateQuizQuestion);
router.delete('/quiz/:id/questions/:questionId', deleteQuizQuestion);

// Category management routes
router.post(
    '/category',
    uploadCategoryIcon.single('icon'),
    handleUploadError,
    createCategory
);
router.get('/category', getSystemCategories);
router.put(
    '/category/:id',
    uploadCategoryIcon.single('icon'),
    handleUploadError,
    updateCategory
);
router.delete('/category/:id', deleteCategory);

// User management routes
router.get('/users', getAllUsers);
router.get('/users/statistics', getUserStatistics);
router.get('/users/:userId', getUserById);
router.post('/users', createUser);
router.put('/users/:userId/role', updateUserRole);
router.delete('/users/:userId', deleteUser);

// Analytics and statistics routes
router.get('/analytics/dashboard', getDashboardStats);
router.get('/analytics/quiz', getQuizAnalytics);
router.get('/analytics/user-engagement', getUserEngagementAnalytics);

export default router;

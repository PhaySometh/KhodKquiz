import express from 'express';
import {
    getSystemCategories,
    getSystemCategoryById,
    getQuizzesByCategory,
} from '../controllers/client/student/category.controller.js';
import {
    getLeaderboard,
    getCategoryLeaderboard,
} from '../controllers/client/leaderboard.controller.js';
import { dbConnectionMiddleware } from '../middleware/dbConnection.middleware.js';

const router = express.Router();

// Apply database connection middleware to all routes
router.use(dbConnectionMiddleware);

// Public category routes (no authentication required)
router.get('/categories', getSystemCategories);
router.get('/categories/:id', getSystemCategoryById);
router.get('/categories/:id/quizzes', getQuizzesByCategory);

// Public leaderboard routes (no authentication required)
router.get('/leaderboard', getLeaderboard);
router.get('/leaderboard/category/:categoryId', getCategoryLeaderboard);

export default router;

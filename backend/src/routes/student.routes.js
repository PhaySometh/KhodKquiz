import express from 'express';

import {
    getSystemQuizById,
    submitQuizResult,
    getStudentProgress,
    checkQuizEligibility,
    getQuizAttemptHistory,
    getAttemptDetails,
    getCategoryStructure,
    getAttemptSelectionData,
} from '../controllers/client/student/quiz.controller.js';

import {
    getSystemCategories,
    getSystemCategoryById,
    getQuizzesByCategory,
    getQuizzesByCategoryWithAttempts,
} from '../controllers/client/student/category.controller.js';

import { authenticate } from '../middleware/auth.middleware.js';
import { dbConnectionMiddleware } from '../middleware/dbConnection.middleware.js';

const router = express.Router();

router.use(authenticate);
router.use(dbConnectionMiddleware);

// Quiz routes
router.get('/quiz/:id', getSystemQuizById);
router.get('/quiz/:quizId/eligibility', checkQuizEligibility);
router.get('/quiz/:quizId/attempts', getQuizAttemptHistory);
router.get('/quiz/:quizId/attempt-selection', getAttemptSelectionData);
router.get('/quiz/result/:resultId', getAttemptDetails);
router.post('/quiz/submit', submitQuizResult);

// Progress and results routes
router.get('/progress', getStudentProgress);
router.get('/category-structure', getCategoryStructure);

// Category routes
router.get('/categories', getSystemCategories);
router.get('/categories/:id', getSystemCategoryById);
router.get('/categories/:id/quizzes', getQuizzesByCategory);
router.get(
    '/categories/:id/quizzes-with-attempts',
    getQuizzesByCategoryWithAttempts
);

export default router;

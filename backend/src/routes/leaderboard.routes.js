import express from 'express';
import {
    getLeaderboard,
    getCategoryLeaderboard,
} from '../controllers/client/leaderboard.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { dbConnectionMiddleware } from '../middleware/dbConnection.middleware.js';

const router = express.Router();

router.use(authenticate);
router.use(dbConnectionMiddleware);

// Leaderboard routes
router.get('/', getLeaderboard);
router.get('/category/:categoryId', getCategoryLeaderboard);

export default router;

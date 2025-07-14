import express from 'express';

import {
    getSystemQuizById
} from '../controllers/client/student/quiz.controller.js';

import {
    getSystemCategories,
    getQuizzesByCategory
} from '../controllers/client/student/category.controller.js';

const router = express.Router();

router.get('/quiz/:id', getSystemQuizById);

router.get('/categories', getSystemCategories);
router.get('/category/:id', getQuizzesByCategory);

export default router;
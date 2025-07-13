import express from 'express';
import {
    adminLogin,
    adminRegister
} from '../controllers/admin/admin.controller.js';

import { 
    createQuiz,
    getQuizzes
} from '../controllers/admin/quiz.controller.js';

import { 
    createCategory,
    getSystemCategories,
    updateCategory,
    deleteCategory
} from '../controllers/admin/category.controller.js';

const router = express.Router();

router.post('/register', adminRegister);
router.post('/login', adminLogin);

router.post('/quiz', createQuiz);
router.get('/quiz', getQuizzes);

router.post('/category', createCategory);
router.get('/category', getSystemCategories);
router.put('/category/:id', updateCategory);
router.delete('/category/:id', deleteCategory);

export default router;
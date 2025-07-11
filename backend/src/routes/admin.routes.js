import express from 'express';
import {
    adminLogin,
    adminRegister
} from '../controllers/admin/admin.controller.js';

import { 
    createQuiz,
    getQuizzes
} from '../controllers/admin/quiz.controller.js';

const router = express.Router();

router.post('/register', adminRegister);
router.post('/login', adminLogin);

router.post('/quiz', createQuiz);
router.get('/quiz', getQuizzes);

export default router;
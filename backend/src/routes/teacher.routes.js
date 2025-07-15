import express from 'express';
import { 
    getQuizzes,
    createQuiz,
} from '../controllers/client/teacher/quiz.controller.js';
import {     
    createClass,
    getClasses
} from '../controllers/client/teacher/class.controller.js';
import { authenticate, isTeacher } from '../middleware/auth.middleware.js';
import { dbConnectionMiddleware } from '../middleware/dbConnection.middleware.js';

const router = express.Router();

router.use(authenticate);
router.use(dbConnectionMiddleware);

router.get('/', getQuizzes);
router.post('/', createQuiz);

router.get('/class', getClasses);
router.post('/class', createClass);

export default router;
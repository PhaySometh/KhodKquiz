import express from 'express';
import { 
    getQuizzes,
    createQuiz,
} from '../controllers/client/teacher/quiz.controller.js';
import {     
    createClass,
    getClasses
} from '../controllers/client/teacher/class.controller.js';

const router = express.Router();

router.get('/', getQuizzes);
router.post('/', createQuiz);

router.get('/class', getClasses);
router.post('/class', createClass);

export default router;
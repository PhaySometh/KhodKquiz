import express from 'express';

import {
    getSystemQuizById
} from '../controllers/client/student/quiz.controller.js';

const router = express.Router();

router.get('/quiz/:id', getSystemQuizById);

export default router;
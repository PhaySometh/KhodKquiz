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

import { getRolePrivileges, updateRolePrivileges } from '../controllers/admin/rolePrivileges.controller.js';

import { authenticate } from '../middleware/auth.middleware.js';
import { dbConnectionMiddleware } from '../middleware/dbConnection.middleware.js';

const router = express.Router();

router.post('/register', adminRegister);
router.post('/login', dbConnectionMiddleware, adminLogin);

router.use(authenticate);
router.use(dbConnectionMiddleware);

router.post('/quiz', createQuiz);
router.get('/quiz', getQuizzes);

router.post('/category', createCategory);
router.get('/category', dbConnectionMiddleware, getSystemCategories);
router.put('/category/:id', updateCategory);
router.delete('/category/:id', deleteCategory);

router.get('/role-privileges', getRolePrivileges);
router.post('/update-role-privileges', updateRolePrivileges);

export default router;
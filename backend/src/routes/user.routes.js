import express from 'express';
import {
    getUsers,
    verifyUser,
    getUser,
    updateUserProfile,
} from '../controllers/user.controller.js';

const router = express.Router();

router.get('/all', getUsers);
router.get('/', getUser);
router.put('/profile', updateUserProfile);
router.post('/auth/google-login', verifyUser);

export default router;

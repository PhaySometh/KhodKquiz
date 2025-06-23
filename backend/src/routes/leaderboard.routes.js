import express from 'express';
import {
    getLeaderboard,
    addNewScore,
    getHighestScore
} from '../controllers/user/getLeaderboard.js';

const router = express.Router();

router.get('/', getLeaderboard);
router.post('/scores', addNewScore);
router.get('/highest', getHighestScore);

export default router;
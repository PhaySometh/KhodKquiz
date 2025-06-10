const express = require('express');
const router = express.Router();
const Score = require('../models/score.model');

// Get leaderboard
router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const leaderboard = await Score.getLeaderboard(limit);
        res.json(leaderboard);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add new score
router.post('/scores', async (req, res) => {
    try {
        const { playerName, score } = req.body;
        const result = await Score.addScore(playerName, score);
        res.status(201).json({ 
            id: result.insertId, 
            playerName, 
            score 
        });
    } catch (error) {
        console.error('Error adding score:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get highest score
router.get('/highest', async (req, res) => {
    try {
        const highScore = await Score.getHighestScore();
        res.json({ highScore });
    } catch (error) {
        console.error('Error fetching highest score:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
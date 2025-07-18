// import setUpModels from '../../../models/index.js';

// // Get leaderboard
// export const getLeaderboard = async (req, res) => {
//     try {
//         const model =  setUpModels(req.db);
//         const limit = parseInt(req.query.limit) || 10;
//         const leaderboard = await Score.getLeaderboard(limit);
//         res.json(leaderboard);
//     } catch (error) {
//         console.error('Error fetching leaderboard:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// // Add new score
// export const addNewScore = async (req, res) => {
//     try {
//         const model =  setUpModels(req.db);
//         const { playerName, score } = req.body;
//         const result = await Score.addScore(playerName, score);
//         res.status(201).json({ 
//             id: result.insertId, 
//             playerName, 
//             score 
//         });
//     } catch (error) {
//         console.error('Error adding score:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// // Get highest score
// export const getHighestScore = async (req, res) => {
//     try {
//         const highScore = await Score.getHighestScore();
//         res.json({ highScore });
//     } catch (error) {
//         console.error('Error fetching highest score:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };
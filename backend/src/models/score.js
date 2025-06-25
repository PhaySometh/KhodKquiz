// import mysql from 'mysql2/promise';
// import dotenv from 'dotenv';

// dotenv.config();

// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });

// class Score {
//     static async getLeaderboard(limit = 10) {
//         try {
//             const [rows] = await pool.query(
//                 `SELECT *, 
//                     (SELECT COUNT(*) + 1 FROM scores s2 WHERE s2.score > s1.score) as rank 
//                 FROM scores s1 
//                 ORDER BY score DESC 
//                 LIMIT ?`,
//                 [limit]
//             );
//             return rows;
//         } catch (error) {
//             throw error;
//         }
//     }

//     static async addScore(playerName, score) {
//         try {
//             const [result] = await pool.query(
//                 'INSERT INTO scores (user, score) VALUES (?, ?)',
//                 [playerName, score]
//             );
//             return result;
//         } catch (error) {
//             throw error;
//         }
//     }

//     static async getHighestScore() {
//         try {
//             const [rows] = await pool.query('SELECT MAX(score) as highScore FROM scores');
//             return rows[0].highScore;
//         } catch (error) {
//             throw error;
//         }
//     }
// }

// export default Score;
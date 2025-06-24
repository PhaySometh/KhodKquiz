import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import leaderboardRoutes from './routes/leaderboard.js';

const PORT = process.env.PORT || 5000;

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/leaderboard', leaderboardRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}/`);
});
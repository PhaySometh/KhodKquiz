const express = require('express');
const cors = require('cors');
require('dotenv').config();
const leaderboardRoutes = require('./routes/leaderboard.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/leaderboard', leaderboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}/`);
});
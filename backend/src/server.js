// Import required modules
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';

// Import routes
import userRoutes from './routes/user.routes.js';
import teacherRoutes from './routes/teacher.routes.js';
import adminRoutes from './routes/admin.routes.js';
import studentRoutes from './routes/student.routes.js';
import teacherApplicationRoutes from './routes/teacherApplication.routes.js';
import leaderboardRoutes from './routes/leaderboard.routes.js';
import publicRoutes from './routes/public.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
// Increase payload limit for profile picture uploads (base64 images can be large)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(helmet());
app.use(morgan('dev'));

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

app.use('/api/public', publicRoutes);
app.use('/api/user', userRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher-application', teacherApplicationRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

try {
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
} catch (error) {
    console.error('❌ Unable to start server:', error);
}

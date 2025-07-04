// Example in src/routes/index.jsx
import { Routes, Route } from 'react-router-dom';

import Leaderboard from '../pages/Leaderboard';
import Login from '../pages/Login';
import Quiz from '../pages/Quiz';
import SignUp from '../pages/SignUp';
import UserDashBoard from '../pages/UserDashBoard';
import User from '../pages/User.jsx';
import TeacherDashboard from'../pages/TeacherDashboard.jsx';
import CreateQuiz from '../pages/CreateQuiz.jsx';
import ManageQuizForm from '../pages/ManageQuiz.jsx';
import QuizAnalytics from '../pages/Analytic.jsx';
import Quizzes from '../pages/Quizzes.jsx';
import Home from '../pages/home.jsx';
function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/leaderboard" element={<Leaderboard/>} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<UserDashBoard />} />
            <Route path='/user' element={<User />} />
            <Route path='/teacher' element={<TeacherDashboard />} />
            <Route path='/teacher/createquiz' element={<CreateQuiz />} />
            <Route path='/teacher/managequiz' element={<ManageQuizForm />} />
            <Route path='/teacher/analytic' element={<QuizAnalytics />} />
            <Route path='/quizzes' element={<Quizzes />} />
        </Routes>
    );
}

export default AppRoutes;

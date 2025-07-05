// Example in src/routes/index.jsx
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

import Leaderboard from '../pages/Leaderboard';
import Login from '../pages/Login';
import Quiz from '../pages/Quiz';
import SignUp from '../pages/SignUp';
import UserDashBoard from '../pages/UserDashBoard';
import User from '../pages/User.jsx';
import TeacherDashboard from '../pages/TeacherDashboard.jsx';
import EnhancedTeacherDashboard from '../pages/EnhancedTeacherDashboard.jsx';
import TeacherRegistrationForm from '../pages/TeacherRegistrationForm.jsx';
import CreateQuiz from '../pages/CreateQuiz.jsx';
import ManageQuizForm from '../pages/ManageQuiz.jsx';
import QuizAnalytics from '../pages/Analytic.jsx';
import Quizzes from '../pages/Quizzes.jsx';
import QuizProgress from '../pages/QuizProgress.jsx';
import QuizRecent from '../pages/QuizRecent.jsx';
import Home from '../pages/home.jsx';
function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/quizzes/category" element={<Quizzes />} />
            <Route path="/teacher-registration" element={<TeacherRegistrationForm />} />

            {/* Protected Quiz Routes */}
            <Route
                path="/quizzes/progress"
                element={
                    <ProtectedRoute>
                        <QuizProgress />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/quizzes/recent"
                element={
                    <ProtectedRoute>
                        <QuizRecent />
                    </ProtectedRoute>
                }
            />

            {/* Protected Routes */}
            <Route
                path="/leaderboard"
                element={
                    <ProtectedRoute>
                        <Leaderboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <UserDashBoard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/user"
                element={
                    <ProtectedRoute>
                        <User />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/teacher"
                element={
                    <ProtectedRoute>
                        <TeacherDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/teacher/enhanced"
                element={
                    <ProtectedRoute>
                        <EnhancedTeacherDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/teacher/createquiz"
                element={
                    <ProtectedRoute>
                        <CreateQuiz />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/teacher/managequiz"
                element={
                    <ProtectedRoute>
                        <ManageQuizForm />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/teacher/analytic"
                element={
                    <ProtectedRoute>
                        <QuizAnalytics />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default AppRoutes;

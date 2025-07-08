// Example in src/routes/index.jsx
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import Leaderboard from '../pages/Leaderboard.jsx';
import Login from '../pages/Login.jsx';
import Quiz from '../pages/Quiz.jsx';
import SignUp from '../pages/SignUp.jsx';
import UserDashBoard from '../pages/client/student/UserDashBoard.jsx';
import User from '../pages/User.jsx';
import TeacherDashboard from '../pages/client/teacher/TeacherDashboard.jsx';
import QuizManagement from '../pages/client/teacher/TeacherQuizManagement.jsx';
import ClassManagement from '../pages/client/teacher/TeacherClassManagement.jsx';
import TeacherRegistrationForm from '../pages/TeacherRegistrationForm.jsx';
import CreateQuiz from '../pages/client/teacher/CreateQuiz.jsx';
import ManageQuizForm from '../pages/ManageQuiz.jsx';
import QuizAnalytics from '../pages/Analytic.jsx';
import QuizCategory from '../pages/QuizCategory.jsx';
import QuizProgress from '../pages/QuizProgress.jsx';
import QuizRecent from '../pages/QuizRecent.jsx';
import Home from '../pages/home.jsx';
import AdminLogin from '../pages/admin/AdminLogin.jsx';
import CreateClass from '../pages/client/teacher/CreateClass.jsx';

import AdminQuizManagement from '../pages/admin/AdminQuizManagement.jsx';
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import AdminCreateQuiz from '../pages/admin/AdminCreateQuiz.jsx';

function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/quiz/category" element={<QuizCategory />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/teacher/create-class" element={<CreateClass />} />

            <Route path='/admin/login' element={<AdminLogin />} />
            <Route
                path="/teacher-registration"
                element={<TeacherRegistrationForm />}
            />

            {/* Protected Quiz Routes */}
            <Route
                path="/quiz/progress"
                element={
                    <ProtectedRoute>
                        <QuizProgress />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/quiz/recent"
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
                path="/student"
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
                path="/teacher/quizzes"
                element={
                    <ProtectedRoute>
                        <QuizManagement />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/teacher/classes"
                element={
                    <ProtectedRoute>
                        <ClassManagement />
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
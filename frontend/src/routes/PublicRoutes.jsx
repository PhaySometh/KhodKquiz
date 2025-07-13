import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home.jsx';
import QuizCategory from '../pages/QuizCategory.jsx';
import SignUp from '../pages/SignUp.jsx';
import Login from '../pages/Login.jsx';
import AdminLogin from '../pages/admin/AdminLogin.jsx';
import TeacherRegistrationForm from '../pages/TeacherRegistrationForm.jsx';
import Leaderboard from '../pages/Leaderboard.jsx';
import Profile from '../pages/User.jsx';

function PublicRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="" element={<Home />} />
            <Route path="quiz/category" element={<QuizCategory />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="login" element={<Login />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="profile" element={<Profile />} />

            {/* Teacher */}
            <Route path="teacher-registration" element={<TeacherRegistrationForm />} />

            {/* Admin */}
            <Route path="admin/login" element={<AdminLogin />} />

        </Routes>
    );
}

export default PublicRoutes;
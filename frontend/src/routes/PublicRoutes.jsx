import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home.jsx';
import QuizCategory from '../pages/QuizCategory.jsx';
import SignUp from '../pages/SignUp.jsx';
import Login from '../pages/Login.jsx';
import Leaderboard from '../pages/Leaderboard.jsx';
import Profile from '../pages/User.jsx';
import Unauthorized from '../pages/Unauthorized.jsx';

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

            {/* Error Pages */}
            <Route path="unauthorized" element={<Unauthorized />} />
        </Routes>
    );
}

export default PublicRoutes;

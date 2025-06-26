// Example in src/routes/index.jsx
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Leaderboard from '../pages/Leaderboard';
import Login from '../pages/Login';
import Quiz from '../pages/Quiz';
import SignUp from '../pages/SignUp';
import UserDashBoard from '../pages/UserDashBoard';
import User from '../pages/User.jsx';

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
        </Routes>
    );
}

export default AppRoutes;

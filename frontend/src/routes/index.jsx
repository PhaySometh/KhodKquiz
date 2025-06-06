// Example in src/routes/index.jsx
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/home';
import Leaderboard from '../pages/Leaderboard';
import Login from '../pages/Login';
import Quiz from '../pages/Quiz';
import SignUp from '../pages/SignUp';

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/leaderboard" element={<Leaderboard/>} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}

export default AppRoutes;

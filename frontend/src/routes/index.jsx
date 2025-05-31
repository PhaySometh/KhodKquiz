// Example in src/routes/index.jsx
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/home';
import Leaderboard from '../pages/Leaderboard';
import Login from '../pages/Login';

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/leaderboard" element={<Leaderboard/>} />
        </Routes>
    );
}

export default AppRoutes;

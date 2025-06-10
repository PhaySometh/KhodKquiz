// Example in src/routes/index.jsx
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Leaderboard from '../pages/Leaderboard';
import Login from '../pages/Login';
import Selection from '../pages/Selection';
import UserDashBoard from '../pages/UserDashBoard';
import Quiz from '../pages/Quiz';
import SignUp from '../pages/SignUp';

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/leaderboard" element={<Leaderboard/>} />
            <Route path="/signup" element={<SignUp />} />
            <Route path='/Selection' element ={<Selection/>} />
            <Route path='/dashBoard' element ={<UserDashBoard/>} />
        </Routes>
    );
}

export default AppRoutes;

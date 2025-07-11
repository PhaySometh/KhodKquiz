import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute.jsx';
import StudentDashBoard from '../pages/client/student/StudentDashBoard.jsx';
import Quiz from '../pages/Quiz.jsx';

function StudentRoutes() {
    return (
        <Routes>
            <Route element={<ProtectedRoute />}>
                <Route path="" element={<StudentDashBoard />} />
                <Route path="quiz/:id" element={<Quiz />} />
            </Route>
        </Routes>
    );
}

export default StudentRoutes;
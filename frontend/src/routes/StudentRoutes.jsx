import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute.jsx';
import StudentDashBoard from '../pages/client/student/StudentDashBoard.jsx';
import StudentQuizzes from '../pages/client/student/StudentQuizzes.jsx';
import Quiz from '../pages/client/student/Quiz.jsx';

function StudentRoutes() {
    return (
        <Routes>
            <Route element={<ProtectedRoute />}>
                <Route path="" element={<StudentDashBoard />} />
                <Route path='category/:id' element={<StudentQuizzes />} />
                <Route path="quiz/:id" element={<Quiz />} />
            </Route>
        </Routes>
    );
}

export default StudentRoutes;
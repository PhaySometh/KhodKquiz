import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute.jsx';
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import AdminQuizManagement from '../pages/admin/AdminQuizManagement.jsx';
import AdminCreateQuiz from '../pages/admin/AdminCreateQuiz.jsx';

function AdminRoutes() {
    return (
        <Routes>
            <Route element={<ProtectedRoute />}>
                <Route path="" element={<AdminDashboard />} />
                <Route path="quizzes" element={<AdminQuizManagement />} />
                <Route path="create-quiz" element={<AdminCreateQuiz />} />
            </Route>
        </Routes>
    );
}

export default AdminRoutes;
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute.jsx';
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import AdminQuizManagement from '../pages/admin/AdminQuizManagement.jsx';
import AdminCreateQuiz from '../pages/admin/AdminCreateQuiz.jsx';
import AdminLogin from '../pages/admin/AdminLogin.jsx';
import AdminCategoryManagement from '../pages/admin/AdminCategoryManagement.jsx';

function AdminRoutes() {
    return (
        <Routes>
            {/* <Route element={<ProtectedRoute />}> */}
                <Route path="" element={<AdminDashboard />} />
                <Route path="login" element={<AdminLogin />} />
                <Route path="quizzes" element={<AdminQuizManagement />} />
                <Route path="create-quiz" element={<AdminCreateQuiz />} />
                <Route path="category" element={<AdminCategoryManagement />} />
            {/* </Route> */}
        </Routes>
    );
}

export default AdminRoutes;
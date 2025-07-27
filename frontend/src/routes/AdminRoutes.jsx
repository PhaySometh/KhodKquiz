import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute.jsx';
import AdminQuizManagement from '../pages/admin/AdminQuizManagement.jsx';
import AdminCreateQuiz from '../pages/admin/AdminCreateQuiz.jsx';
import AdminCategoryManagement from '../pages/admin/AdminCategoryManagement.jsx';
import AdminGrantAccess from '../pages/admin/AdminGrantAccess.jsx';
import TeacherRequests from '../pages/admin/TeacherRequests.jsx';

/**
 * Admin Routes
 *
 * All admin routes require authentication with admin role.
 * Admin users should login through the main login page (/login) with their admin account.
 */
function AdminRoutes() {
    return (
        <Routes>
            {/* All admin routes require admin role */}
            <Route element={<ProtectedRoute requiredRole="admin" />}>
                <Route path="" element={<AdminGrantAccess />} />
                <Route path="quizzes" element={<AdminQuizManagement />} />
                <Route path="create-quiz" element={<AdminCreateQuiz />} />
                <Route path="category" element={<AdminCategoryManagement />} />
                <Route path="teacher-requests" element={<TeacherRequests />} />
            </Route>
        </Routes>
    );
}

export default AdminRoutes;

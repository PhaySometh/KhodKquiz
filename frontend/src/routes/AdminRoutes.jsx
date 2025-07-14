import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute.jsx';
import AdminQuizManagement from '../pages/admin/AdminQuizManagement.jsx';
import AdminCreateQuiz from '../pages/admin/AdminCreateQuiz.jsx';
import AdminLogin from '../pages/admin/AdminLogin.jsx';
import AdminCategoryManagement from '../pages/admin/AdminCategoryManagement.jsx';
import AdminGrantAccess from '../pages/admin/AdminGrantAccess.jsx';
import TeacherRequests from '../pages/admin/TeacherRequests.jsx';
import AdminStatsDashboard from '../components/admin/AdminStatsDashboard.jsx';

function AdminRoutes() {
    return (
        <Routes>
            {/* <Route element={<ProtectedRoute />}> */}
                <Route path="" element={<AdminGrantAccess />} />
                <Route path="login" element={<AdminLogin />} />
                <Route path="quizzes" element={<AdminQuizManagement />} />
                <Route path="create-quiz" element={<AdminCreateQuiz />} />
                <Route path="category" element={<AdminCategoryManagement />} />
                <Route path="teacher-requests" element={<TeacherRequests />} />
            {/* </Route> */}
        </Routes>
    );
}

export default AdminRoutes;

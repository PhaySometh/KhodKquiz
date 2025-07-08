import { Routes, Route } from 'react-router-dom';
import PublicRoutes from './PublicRoutes.jsx';
import StudentRoutes from './StudentRoutes.jsx';
import TeacherRoutes from './TeacherRoutes.jsx';
import AdminRoutes from './AdminRoutes.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx'; // Optional fallback

function AppRoutes() {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/*" element={<PublicRoutes />} />

            {/* Student routes */}
            <Route path="/student/*" element={<StudentRoutes />} />

            {/* Teacher routes */}
            <Route path="/teacher/*" element={<TeacherRoutes />} />

            {/* Admin routes */}
            <Route path="/admin/*" element={<AdminRoutes />} />

            {/* Optional: catch-all 404 route */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

export default AppRoutes;
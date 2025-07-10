import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute.jsx';
import StudentDashBoard from '../pages/client/student/StudentDashBoard.jsx';

function StudentRoutes() {
    return (
        <Routes>
            <Route element={<ProtectedRoute />}>
                <Route path="student" element={<StudentDashBoard />} />
            </Route>
        </Routes>
    );
}

export default StudentRoutes;
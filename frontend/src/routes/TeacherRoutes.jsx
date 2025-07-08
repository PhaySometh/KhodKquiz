import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import TeacherDashboard from '../pages/client/teacher/TeacherDashboard.jsx';
import TeacherClassManagement from '../pages/client/teacher/TeacherClassManagement.jsx';
import TeacherQuizManagement from '../pages/client/teacher/TeacherQuizManagement.jsx';
import CreateQuiz from '../pages/client/teacher/CreateQuiz.jsx';
import CreateClass from '../pages/client/teacher/CreateClass.jsx';

function TeacherRoutes() {
    return (
        <Routes>
            <Route element={<ProtectedRoute />}>
                <Route path="" element={<TeacherDashboard />} />
                <Route path="classes" element={<TeacherClassManagement />} />
                <Route path="quizzes" element={<TeacherQuizManagement />} />
                <Route path="create-quiz" element={<CreateQuiz />} />
                <Route path="create-class" element={<CreateClass />} />
            </Route>
        </Routes>
    );
}

export default TeacherRoutes;
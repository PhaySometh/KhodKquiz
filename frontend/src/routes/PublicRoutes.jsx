import { Routes, Route } from 'react-router-dom';

function PublicRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/quiz/category" element={<QuizCategory />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/teacher/create-class" element={<CreateClass />} />
        </Routes>
    );
}

export default PublicRoutes;
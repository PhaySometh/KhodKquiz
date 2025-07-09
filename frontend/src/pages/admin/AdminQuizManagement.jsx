import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AdminSidebar from '../../components/admin/AdminSidebar.jsx';
import QuizList from '../../components/QuizList.jsx';
import { DeleteQuizModal, AssignToClassModal, ArchiveQuizModal } from '../../components/QuizActionModals.jsx';
import AdminNavbar from '../../components/admin/AdminNavbar.jsx';
import Footer from '../../components/common/Footer.jsx';

const AdminQuizManagement = () => {
    const navigate = useNavigate();
    
    // Modal states
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, quiz: null });
    const [assignModal, setAssignModal] = useState({ isOpen: false, quiz: null });
    const [archiveModal, setArchiveModal] = useState({ isOpen: false, quiz: null });

    // Quiz action handlers
    const handleCreateQuiz = () => {
        navigate('/admin/create-quiz');
    };

    const handleEditQuiz = (quiz) => {
        // Navigate to edit page with quiz ID
        navigate(`/teacher/managequiz?id=${quiz.id}`);
    };

    const handleDeleteQuiz = (quiz) => {
        setDeleteModal({ isOpen: true, quiz });
    };

    const handleConfirmDelete = (quiz) => {
        // Implement actual delete logic here
        toast.success(`Quiz "${quiz.title}" has been deleted`);
        console.log('Deleting quiz:', quiz);
    };

    const handleDuplicateQuiz = (quiz) => {
        // Implement duplicate logic here
        toast.success(`Quiz "${quiz.title}" has been duplicated`);
        console.log('Duplicating quiz:', quiz);
    };

    const handleAssignToClass = (quiz) => {
        setAssignModal({ isOpen: true, quiz });
    };

    const handleConfirmAssign = (assignmentData) => {
        // Implement actual assignment logic here
        const { quiz, classes, settings } = assignmentData;
        toast.success(`Quiz "${quiz.title}" assigned to ${classes.length} class${classes.length !== 1 ? 'es' : ''}`);
        console.log('Assigning quiz:', assignmentData);
    };

    const handleArchiveQuiz = (quiz) => {
        setArchiveModal({ isOpen: true, quiz });
    };

    const handleConfirmArchive = (quiz) => {
        // Implement actual archive logic here
        toast.success(`Quiz "${quiz.title}" has been archived`);
        console.log('Archiving quiz:', quiz);
    };

    return (
        <>
            <div className='flex h-screen bg-gray-50 overflow-hidden'>
                <AdminSidebar />
                <div className='w-full overflow-y-auto'>
                    <AdminNavbar />

                    {/* Main Content */}
                    <div className='p-6 h-full w-full'>
                        {/* Welcome Section - Simplified version */}
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="relative w-full flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 mb-8"
                        >
                            <h3 className="text-2xl md:text-3xl text-blue-950 font-bold text-center mb-2">
                                Manage Your Quizzes
                            </h3>
                            <p className="text-gray-600 text-center max-w-2xl">
                                Create, edit, and assign quizzes to your classes. Track student progress and performance.
                            </p>
                        </motion.div>

                        {/* Quiz Management Section */}
                        <QuizList
                            onCreateQuiz={handleCreateQuiz}
                            onEditQuiz={handleEditQuiz}
                            onDeleteQuiz={handleDeleteQuiz}
                            onDuplicateQuiz={handleDuplicateQuiz}
                            onAssignToClass={handleAssignToClass}
                            onArchiveQuiz={handleArchiveQuiz}
                        />
                    </div>
                </div>

                {/* Modals */}
                <DeleteQuizModal
                    isOpen={deleteModal.isOpen}
                    onClose={() => setDeleteModal({ isOpen: false, quiz: null })}
                    quiz={deleteModal.quiz}
                    onConfirm={handleConfirmDelete}
                />

                <AssignToClassModal
                    isOpen={assignModal.isOpen}
                    onClose={() => setAssignModal({ isOpen: false, quiz: null })}
                    quiz={assignModal.quiz}
                    onAssign={handleConfirmAssign}
                />

                <ArchiveQuizModal
                    isOpen={archiveModal.isOpen}
                    onClose={() => setArchiveModal({ isOpen: false, quiz: null })}
                    quiz={archiveModal.quiz}
                    onConfirm={handleConfirmArchive}
                />
            </div>
            <Footer />
        </>
    );
};

export default AdminQuizManagement;
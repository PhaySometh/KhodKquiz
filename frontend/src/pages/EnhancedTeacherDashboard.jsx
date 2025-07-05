import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Sidebar from '../components/NavBarDashBoard.jsx';
import QuizList from '../components/QuizList';
import { DeleteQuizModal, AssignToClassModal, ArchiveQuizModal } from '../components/QuizActionModals';

const EnhancedTeacherDashboard = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    
    // Modal states
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, quiz: null });
    const [assignModal, setAssignModal] = useState({ isOpen: false, quiz: null });
    const [archiveModal, setArchiveModal] = useState({ isOpen: false, quiz: null });

    // Mock notifications - keeping the same as original
    useEffect(() => {
        setNotifications([
            { id: 1, text: 'New JavaScript quiz available!', time: '10 min ago', read: false },
            { id: 2, text: 'You earned the "Quick Learner" badge', time: '2 hours ago', read: true },
            { id: 3, text: 'Weekly progress report is ready', time: '1 day ago', read: true },
        ]);
    }, []);

    const markNotificationAsRead = (id) => {
        setNotifications(notifications.map(n => 
            n.id === id ? {...n, read: true} : n
        ));
    };

    const unreadNotifications = notifications.filter(n => !n.read).length;

    // Quiz action handlers
    const handleCreateQuiz = () => {
        navigate('/teacher/createquiz');
    };

    const handleEditQuiz = (quiz) => {
        // Navigate to edit page with quiz ID
        navigate(`/teacher/managequiz?id=${quiz.id}`);
    };

    const handlePreviewQuiz = (quiz) => {
        // Open quiz preview in new tab or modal
        toast.success(`Opening preview for "${quiz.title}"`);
        // You can implement actual preview functionality here
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
        <div className='flex h-screen bg-gray-50 overflow-hidden'>
            <Sidebar />
            <div className='w-full overflow-y-auto'>
                {/* Header - Exact same as original */}
                <header className="relative z-10 px-6 flex justify-between items-center w-full h-20 bg-white border-b border-gray-200">
                    <div className="text-xl font-bold hidden md:block">
                        <h1 className='text-blue-950'>Teacher <span className='text-orange-400'>Dashboard</span></h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <button 
                                className="relative p-1 rounded-full hover:bg-gray-100"
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                <Bell className="text-gray-600" size={20} />
                                {unreadNotifications > 0 && (
                                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                                )}
                            </button>

                            <div className="relative">
                                <button 
                                    className="flex items-center space-x-2 focus:outline-none"
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                        <User size={16} />
                                    </div>
                                </button>

                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                                            <User size={16} className="mr-2" /> Profile
                                        </a>
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                                            <Settings size={16} className="mr-2" /> Settings
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Notifications dropdown - Exact same as original */}
                    {showNotifications && (
                        <div className="absolute right-4 top-16 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                            <div className="p-3 border-b border-gray-200 font-medium text-gray-700">
                                Notifications
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map(notification => (
                                        <div 
                                            key={notification.id} 
                                            className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                                            onClick={() => markNotificationAsRead(notification.id)}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">{notification.text}</p>
                                                    <p className="text-xs text-gray-500">{notification.time}</p>
                                                </div>
                                                {!notification.read && (
                                                    <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-gray-500 text-sm">
                                        No new notifications
                                    </div>
                                )}
                            </div>
                            <div className="p-2 text-center text-sm text-blue-600 hover:bg-gray-50 cursor-pointer border-t border-gray-200">
                                View all notifications
                            </div>
                        </div>
                    )}
                </header>

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
                        onPreviewQuiz={handlePreviewQuiz}
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
    );
};

export default EnhancedTeacherDashboard;

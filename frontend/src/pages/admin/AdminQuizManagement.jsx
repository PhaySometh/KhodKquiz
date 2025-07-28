import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
    Plus,
    Search,
    Filter,
    Download,
    Upload,
    Trash2,
    Edit,
    Copy,
    MoreVertical,
    CheckSquare,
    Square,
    FolderOpen,
} from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar.jsx';
import QuizList from '../../components/QuizList.jsx';
import {
    DeleteQuizModal,
    AssignToClassModal,
    ArchiveQuizModal,
} from '../../components/QuizActionModals.jsx';
import AdminEditQuizModal from '../../components/admin/AdminEditQuizModal.jsx';
import AdminNavbar from '../../components/admin/AdminNavbar.jsx';
import apiClient from '../../utils/axiosConfig.js';

const AdminQuizManagement = () => {
    const navigate = useNavigate();

    // Modal states
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        quiz: null,
    });
    const [assignModal, setAssignModal] = useState({
        isOpen: false,
        quiz: null,
    });
    const [archiveModal, setArchiveModal] = useState({
        isOpen: false,
        quiz: null,
    });
    const [editModal, setEditModal] = useState({
        isOpen: false,
        quizId: null,
    });

    // Enhanced states for bulk operations and filtering
    const [quizzes, setQuizzes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedQuizzes, setSelectedQuizzes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterDifficulty, setFilterDifficulty] = useState('');
    const [showBulkActions, setShowBulkActions] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showTemplatesModal, setShowTemplatesModal] = useState(false);

    // Data fetching
    useEffect(() => {
        fetchQuizzes();
        fetchCategories();
    }, []);

    // Refresh data when returning to this page (e.g., from edit page)
    useEffect(() => {
        const handleFocus = () => {
            // Refresh data when window regains focus (user returns from edit page)
            if (!document.hidden) {
                refreshQuizzes();
            }
        };

        window.addEventListener('focus', handleFocus);
        document.addEventListener('visibilitychange', handleFocus);

        return () => {
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('visibilitychange', handleFocus);
        };
    }, []);

    const fetchQuizzes = async (showLoadingSpinner = true) => {
        try {
            if (showLoadingSpinner) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }
            const response = await apiClient.get('/api/admin/quiz');
            setQuizzes(response.data.data || []);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
            toast.error('Failed to fetch quizzes');
        } finally {
            if (showLoadingSpinner) {
                setLoading(false);
            } else {
                setRefreshing(false);
            }
        }
    };

    // Refresh function for background updates
    const refreshQuizzes = async () => {
        await fetchQuizzes(false);
    };

    const fetchCategories = async () => {
        try {
            const response = await apiClient.get('/api/admin/category');
            setCategories(response.data.data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Quiz action handlers
    const handleCreateQuiz = () => {
        navigate('/admin/create-quiz');
    };

    const handleEditQuiz = (quiz) => {
        // Open edit modal with quiz ID
        setEditModal({
            isOpen: true,
            quizId: quiz.id,
        });
    };

    const handleDeleteQuiz = (quiz) => {
        setDeleteModal({ isOpen: true, quiz });
    };

    const handleConfirmDelete = async (quiz) => {
        try {
            setRefreshing(true);
            await apiClient.delete(`/api/admin/quiz/${quiz.id}`);
            toast.success(`Quiz "${quiz.title}" has been deleted`);
            await refreshQuizzes(); // Refresh the quiz list
            setDeleteModal({ isOpen: false, quiz: null });
        } catch (error) {
            console.error('Error deleting quiz:', error);
            if (error.response?.status === 409) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to delete quiz. Please try again.');
            }
        } finally {
            setRefreshing(false);
        }
    };

    // Bulk operations handlers
    const handleSelectAll = () => {
        if (selectedQuizzes.length === filteredQuizzes.length) {
            setSelectedQuizzes([]);
        } else {
            setSelectedQuizzes(filteredQuizzes.map((quiz) => quiz.id));
        }
    };

    const handleSelectQuiz = (quizId) => {
        setSelectedQuizzes((prev) =>
            prev.includes(quizId)
                ? prev.filter((id) => id !== quizId)
                : [...prev, quizId]
        );
    };

    const handleBulkDelete = async () => {
        if (selectedQuizzes.length === 0) {
            toast.error('Please select quizzes to delete');
            return;
        }

        if (
            !confirm(
                `Are you sure you want to delete ${selectedQuizzes.length} quiz(es)?`
            )
        ) {
            return;
        }

        try {
            setRefreshing(true);
            await apiClient.post('/api/admin/quiz/bulk-delete', {
                quizIds: selectedQuizzes,
            });
            toast.success(
                `${selectedQuizzes.length} quiz(es) deleted successfully`
            );
            setSelectedQuizzes([]);
            await refreshQuizzes();
        } catch (error) {
            console.error('Error bulk deleting quizzes:', error);
            if (error.response?.status === 409) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to delete quizzes');
            }
        } finally {
            setRefreshing(false);
        }
    };

    const handleBulkCategoryReassign = async (newCategoryId) => {
        if (selectedQuizzes.length === 0) {
            toast.error('Please select quizzes to reassign');
            return;
        }

        try {
            setRefreshing(true);
            await apiClient.post('/api/admin/quiz/bulk-reassign-category', {
                quizIds: selectedQuizzes,
                newCategoryId,
            });
            toast.success(
                `${selectedQuizzes.length} quiz(es) reassigned successfully`
            );
            setSelectedQuizzes([]);
            await refreshQuizzes();
        } catch (error) {
            console.error('Error bulk reassigning category:', error);
            toast.error('Failed to reassign category');
        } finally {
            setRefreshing(false);
        }
    };

    const handleDuplicateQuiz = async (quiz) => {
        try {
            setRefreshing(true);
            // First get the full quiz details including questions
            const response = await apiClient.get(`/api/admin/quiz/${quiz.id}`);
            const quizData = response.data.data;

            // Create a new quiz with duplicated data
            const duplicatedQuiz = {
                title: `${quizData.title} (Copy)`,
                description: quizData.description,
                category: quizData.category,
                difficulty: quizData.difficulty,
                time: quizData.time,
                questions: quizData.questions,
                questionsCount: quizData.questionsCount,
            };

            await apiClient.post('/api/admin/quiz', duplicatedQuiz);
            toast.success(`Quiz "${quiz.title}" has been duplicated`);
            await refreshQuizzes(); // Refresh the quiz list
        } catch (error) {
            console.error('Error duplicating quiz:', error);
            toast.error('Failed to duplicate quiz. Please try again.');
        } finally {
            setRefreshing(false);
        }
    };

    // Import/Export handlers
    const handleExportQuiz = async (quiz) => {
        try {
            const response = await apiClient.get(
                `/api/admin/quiz/${quiz.id}/export`
            );
            const exportData = response.data.data;

            // Create and download JSON file
            const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                type: 'application/json',
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${quiz.title
                .replace(/[^a-z0-9]/gi, '_')
                .toLowerCase()}_export.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast.success(`Quiz "${quiz.title}" exported successfully`);
        } catch (error) {
            console.error('Error exporting quiz:', error);
            toast.error('Failed to export quiz');
        }
    };

    const handleImportQuiz = async (file) => {
        try {
            const text = await file.text();
            const quizData = JSON.parse(text);

            await apiClient.post('/api/admin/quiz/import', { quizData });
            toast.success('Quiz imported successfully');
            fetchQuizzes();
            setShowImportModal(false);
        } catch (error) {
            console.error('Error importing quiz:', error);
            toast.error('Failed to import quiz. Please check the file format.');
        }
    };

    // Filtering logic
    const filteredQuizzes = quizzes.filter((quiz) => {
        const matchesSearch =
            quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quiz.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
            !filterCategory || quiz.category === parseInt(filterCategory);
        const matchesDifficulty =
            !filterDifficulty || quiz.difficulty === filterDifficulty;

        return matchesSearch && matchesCategory && matchesDifficulty;
    });

    const handleAssignToClass = (quiz) => {
        setAssignModal({ isOpen: true, quiz });
    };

    const handleConfirmAssign = (assignmentData) => {
        // Implement actual assignment logic here
        const { quiz, classes, settings } = assignmentData;
        toast.success(
            `Quiz "${quiz.title}" assigned to ${classes.length} class${
                classes.length !== 1 ? 'es' : ''
            }`
        );
        // Assignment logic implementation would go here
    };

    const handleArchiveQuiz = (quiz) => {
        setArchiveModal({ isOpen: true, quiz });
    };

    const handleConfirmArchive = (quiz) => {
        // Implement actual archive logic here
        toast.success(`Quiz "${quiz.title}" has been archived`);
        // Archive logic implementation would go here
    };

    return (
        <>
            <div className="flex h-screen bg-gray-50 overflow-hidden">
                <AdminSidebar />
                <div className="w-full overflow-y-auto">
                    <AdminNavbar />

                    {/* Main Content */}
                    <div className="p-6 h-full w-full">
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
                                Create, edit, and assign quizzes to your
                                classes. Track student progress and performance.
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
                            externalQuizzes={quizzes}
                            externalLoading={loading}
                            externalRefreshing={refreshing}
                            onRefresh={refreshQuizzes}
                        />
                    </div>
                </div>

                {/* Modals */}
                <DeleteQuizModal
                    isOpen={deleteModal.isOpen}
                    onClose={() =>
                        setDeleteModal({ isOpen: false, quiz: null })
                    }
                    quiz={deleteModal.quiz}
                    onConfirm={handleConfirmDelete}
                />

                <AssignToClassModal
                    isOpen={assignModal.isOpen}
                    onClose={() =>
                        setAssignModal({ isOpen: false, quiz: null })
                    }
                    quiz={assignModal.quiz}
                    onAssign={handleConfirmAssign}
                />

                <ArchiveQuizModal
                    isOpen={archiveModal.isOpen}
                    onClose={() =>
                        setArchiveModal({ isOpen: false, quiz: null })
                    }
                    quiz={archiveModal.quiz}
                    onConfirm={handleConfirmArchive}
                />

                <AdminEditQuizModal
                    isOpen={editModal.isOpen}
                    onClose={() =>
                        setEditModal({ isOpen: false, quizId: null })
                    }
                    quizId={editModal.quizId}
                    onSave={refreshQuizzes}
                />
            </div>
        </>
    );
};

export default AdminQuizManagement;

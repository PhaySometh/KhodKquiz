import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Code,
    Clock,
    BarChart2,
    ChevronLeft,
    BookOpen,
    AlertCircle,
    Brain,
    Database,
    Cpu,
    Globe,
    Languages,
    FlaskConical,
    ScrollText,
    Play,
    Users,
    Eye,
} from 'lucide-react';
import Navbar from '../../../components/common/Navbar';
import QuizHero, { QuizTabs } from '../../../components/QuizHero';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import AuthPrompt from '../../../components/AuthPrompt';
import apiClient from '../../../utils/axiosConfig';
import LoadingSpinner from '../../../components/LoadingSpinner';
import QuizResultReview from '../../../components/QuizResultReview';
import AttemptSelectionModal from '../../../components/AttemptSelectionModal';

// Icon mapping for categories
const getCategoryIcon = (categoryName) => {
    const iconMap = {
        JavaScript: <Code />,
        Python: <BookOpen />,
        'C++': <Cpu />,
        'Web Development': <Globe />,
        'Data Science': <Database />,
        'General Knowledge': <Brain />,
        'Language Translation': <Languages />,
        Science: <FlaskConical />,
        History: <ScrollText />,
        Programming: <Code />,
        Technology: <Cpu />,
        Mathematics: <Brain />,
        default: <AlertCircle />,
    };
    return iconMap[categoryName] || iconMap['default'];
};

export default function CategoryQuizzes() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('categories');
    const [showAuthPrompt, setShowAuthPrompt] = useState(false);
    const [quizzes, setQuizzes] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedResultId, setSelectedResultId] = useState(null);
    const [showAttemptModal, setShowAttemptModal] = useState(false);
    const [selectedQuizForAttempts, setSelectedQuizForAttempts] =
        useState(null);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch category details and quizzes with attempt information
                const categoryResponse = await apiClient.get(
                    `/api/public/categories/${id}`
                );

                // Use different endpoint based on authentication status
                const quizzesEndpoint = isAuthenticated
                    ? `/api/student/categories/${id}/quizzes-with-attempts`
                    : `/api/public/categories/${id}/quizzes`;

                const quizzesResponse = await apiClient.get(quizzesEndpoint);

                const categoryData = categoryResponse.data.data;
                const quizzesData = quizzesResponse.data.data;

                // Set category with icon
                setCategory({
                    ...categoryData,
                    icon: getCategoryIcon(categoryData.name),
                    color: 'bg-blue-100 text-blue-600',
                });

                setQuizzes(quizzesData);
            } catch (error) {
                console.error('Error fetching data:', error);
                console.error('Error details:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                    categoryId: id,
                });
                setCategory(null);
                setQuizzes([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, isAuthenticated]);

    // Tab handling logic
    const handleTabClick = (tab) => {
        if ((tab === 'progress' || tab === 'recent') && !isAuthenticated) {
            setShowAuthPrompt(true);
            return;
        }

        if (tab === 'categories') {
            navigate('/quiz/category');
            return;
        }

        if (tab === 'progress') {
            navigate('/quiz/progress');
            return;
        }

        if (tab === 'recent') {
            navigate('/quiz/recent');
            return;
        }

        setActiveTab(tab);
    };

    // Handle attempt selection
    const handleViewResults = (quiz) => {
        if (quiz.attemptInfo.attemptCount === 1) {
            // If only one attempt, directly show results
            setSelectedResultId(quiz.attemptInfo.latestAttemptId);
        } else {
            // If multiple attempts, show selection modal
            setSelectedQuizForAttempts(quiz);
            setShowAttemptModal(true);
        }
    };

    const handleAttemptSelection = (attemptId) => {
        setSelectedResultId(attemptId);
        setShowAttemptModal(false);
        setSelectedQuizForAttempts(null);
    };

    // Filter quizzes based on search query
    const filteredQuizzes = quizzes.filter((quiz) =>
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Shared Hero Section */}
                    <QuizHero
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        activeTab={activeTab}
                        handleTabClick={handleTabClick}
                    />

                    {/* Tabs */}
                    <QuizTabs
                        activeTab={activeTab}
                        handleTabClick={handleTabClick}
                    />

                    {/* Content based on active tab */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key="category-quizzes"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Category Header */}
                            <div className="flex items-center gap-4 mb-6">
                                <button
                                    onClick={() => navigate('/quiz/category')}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                {category && (
                                    <div
                                        className={`${category.color} p-3 rounded-full`}
                                    >
                                        {category.icon}
                                    </div>
                                )}
                                <div>
                                    <h4 className="text-2xl font-bold text-blue-950">
                                        {category?.name || 'Category'} Quizzes
                                    </h4>
                                    <p className="text-gray-600">
                                        {category?.description ||
                                            'Loading category details...'}
                                    </p>
                                </div>
                            </div>

                            {/* Loading State */}
                            {loading ? (
                                <div className="flex justify-center items-center py-12">
                                    <LoadingSpinner size="large" />
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {filteredQuizzes.length > 0 ? (
                                        filteredQuizzes.map((quiz, index) => (
                                            <motion.div
                                                key={quiz.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    delay: index * 0.05,
                                                }}
                                                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden group"
                                            >
                                                <div className="p-6">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                                                            <BookOpen
                                                                size={20}
                                                            />
                                                        </div>
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                                quiz.difficulty ===
                                                                    'Easy' ||
                                                                quiz.difficulty ===
                                                                    'Beginner'
                                                                    ? 'bg-green-100 text-green-600'
                                                                    : quiz.difficulty ===
                                                                          'Medium' ||
                                                                      quiz.difficulty ===
                                                                          'Intermediate'
                                                                    ? 'bg-yellow-100 text-yellow-600'
                                                                    : 'bg-red-100 text-red-600'
                                                            }`}
                                                        >
                                                            {quiz.difficulty ||
                                                                'Medium'}
                                                        </span>
                                                    </div>

                                                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-950 transition-colors">
                                                        {quiz.title}
                                                    </h3>

                                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                        {quiz.description ||
                                                            'Test your knowledge with this quiz'}
                                                    </p>

                                                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                                        <div className="flex items-center">
                                                            <BarChart2
                                                                size={16}
                                                                className="mr-1"
                                                            />
                                                            {quiz.questionsCount ||
                                                                0}{' '}
                                                            questions
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Clock
                                                                size={16}
                                                                className="mr-1"
                                                            />
                                                            {quiz.time || 15}{' '}
                                                            min
                                                        </div>
                                                    </div>

                                                    {/* Attempt Status and Actions */}
                                                    {isAuthenticated &&
                                                    quiz.attemptInfo ? (
                                                        <div className="space-y-3">
                                                            {/* Attempt Information */}
                                                            <div className="flex items-center justify-between text-sm">
                                                                <span className="text-gray-500">
                                                                    Attempts:{' '}
                                                                    {
                                                                        quiz
                                                                            .attemptInfo
                                                                            .attemptCount
                                                                    }
                                                                    /
                                                                    {
                                                                        quiz
                                                                            .attemptInfo
                                                                            .maxAttempts
                                                                    }
                                                                </span>
                                                                <span className="text-gray-500">
                                                                    Remaining:{' '}
                                                                    {
                                                                        quiz
                                                                            .attemptInfo
                                                                            .remainingAttempts
                                                                    }
                                                                </span>
                                                            </div>

                                                            {/* Action Buttons */}
                                                            <div className="flex gap-2">
                                                                {quiz
                                                                    .attemptInfo
                                                                    .canAttempt ? (
                                                                    <button
                                                                        onClick={() =>
                                                                            navigate(
                                                                                `/student/quiz/${quiz.id}`
                                                                            )
                                                                        }
                                                                        className="flex-1 bg-blue-950 text-white px-3 py-2 rounded-lg font-medium hover:bg-orange-400 transition-all shadow-sm flex items-center justify-center gap-2"
                                                                    >
                                                                        <Play
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                        {quiz
                                                                            .attemptInfo
                                                                            .hasAttempts
                                                                            ? 'Reattempt'
                                                                            : 'Start Quiz'}
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        disabled
                                                                        className="flex-1 bg-gray-400 text-white px-3 py-2 rounded-lg font-medium cursor-not-allowed opacity-50 flex items-center justify-center gap-2"
                                                                    >
                                                                        <Play
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                        Max
                                                                        Attempts
                                                                    </button>
                                                                )}

                                                                {quiz
                                                                    .attemptInfo
                                                                    .hasAttempts && (
                                                                    <button
                                                                        onClick={() =>
                                                                            handleViewResults(
                                                                                quiz
                                                                            )
                                                                        }
                                                                        className="bg-green-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-green-700 transition-all shadow-sm flex items-center gap-2"
                                                                    >
                                                                        <Eye
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                        {quiz
                                                                            .attemptInfo
                                                                            .attemptCount >
                                                                        1
                                                                            ? 'View Results'
                                                                            : 'Results'}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        /* Unauthenticated or no attempt info */
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center text-sm text-gray-500">
                                                                <Users
                                                                    size={16}
                                                                    className="mr-1"
                                                                />
                                                                {quiz.attempts ||
                                                                    0}{' '}
                                                                attempts
                                                            </div>
                                                            <button
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/student/quiz/${quiz.id}`
                                                                    )
                                                                }
                                                                className="bg-blue-950 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-400 transition-all shadow-sm flex items-center gap-2"
                                                            >
                                                                <Play
                                                                    size={16}
                                                                />
                                                                Start
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center py-12">
                                            <BookOpen
                                                size={48}
                                                className="mx-auto text-gray-400 mb-4"
                                            />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                No quizzes found
                                            </h3>
                                            <p className="text-gray-500">
                                                {searchQuery
                                                    ? `No quizzes match "${searchQuery}"`
                                                    : 'No quizzes available in this category yet.'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Authentication Prompt */}
                    <AuthPrompt
                        isOpen={showAuthPrompt}
                        onClose={() => setShowAuthPrompt(false)}
                        title="Authentication Required"
                        message="Please sign in to access quiz content."
                    />

                    {/* Attempt Selection Modal */}
                    <AttemptSelectionModal
                        isOpen={showAttemptModal}
                        onClose={() => {
                            setShowAttemptModal(false);
                            setSelectedQuizForAttempts(null);
                        }}
                        quizId={selectedQuizForAttempts?.id}
                        onSelectAttempt={handleAttemptSelection}
                    />

                    {/* Quiz Result Review Modal */}
                    {selectedResultId && (
                        <QuizResultReview
                            resultId={selectedResultId}
                            onClose={() => setSelectedResultId(null)}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}

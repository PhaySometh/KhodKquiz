import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Code,
    Languages,
    Brain,
    BookOpen,
    Database,
    Cpu,
    Globe,
    FlaskConical,
    ScrollText,
    AlertCircle,
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthPrompt from '../components/AuthPrompt';
import QuizHero, { QuizTabs } from '../components/QuizHero';
import apiClient from '../utils/axiosConfig';
import LoadingSpinner from '../components/LoadingSpinner';

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

// Color mapping for categories
const getCategoryColor = (index) => {
    const colors = [
        'bg-yellow-100 text-yellow-600',
        'bg-blue-100 text-blue-600',
        'bg-purple-100 text-purple-600',
        'bg-green-100 text-green-600',
        'bg-red-100 text-red-600',
        'bg-indigo-100 text-indigo-600',
        'bg-pink-100 text-pink-600',
        'bg-cyan-100 text-cyan-600',
        'bg-amber-100 text-amber-600',
        'bg-orange-100 text-orange-600',
    ];
    return colors[index % colors.length];
};

export default function QuizCategory() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('categories');
    const [showAuthPrompt, setShowAuthPrompt] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    // Fetch categories and quiz counts
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiClient.get('/api/public/categories');
                const categoriesData = response.data.data || [];

                // Fetch quiz counts and progress for each category
                const categoriesWithCounts = await Promise.all(
                    categoriesData.map(async (category, index) => {
                        try {
                            // Fetch quizzes for this category
                            const quizzesEndpoint = isAuthenticated
                                ? `/api/student/categories/${category.id}/quizzes-with-attempts`
                                : `/api/public/categories/${category.id}/quizzes`;

                            const quizzesResponse = await apiClient.get(
                                quizzesEndpoint
                            );
                            const quizzesData = quizzesResponse.data.data || [];
                            const quizCount = quizzesData.length;

                            // Calculate progress if user is authenticated
                            let progress = 0;
                            if (isAuthenticated && quizzesData.length > 0) {
                                const completedQuizzes = quizzesData.filter(
                                    (quiz) =>
                                        quiz.attemptInfo &&
                                        quiz.attemptInfo.hasAttempts
                                ).length;
                                progress = Math.round(
                                    (completedQuizzes / quizzesData.length) *
                                        100
                                );
                            }

                            return {
                                id: category.id,
                                name: category.name,
                                description: category.description,
                                icon: getCategoryIcon(category.name),
                                questions: quizCount,
                                color: getCategoryColor(index),
                                progress: progress,
                            };
                        } catch (error) {
                            console.error(
                                `Error fetching quizzes for category ${category.name}:`,
                                error
                            );
                            return {
                                id: category.id,
                                name: category.name,
                                description: category.description,
                                icon: getCategoryIcon(category.name),
                                questions: 0,
                                color: getCategoryColor(index),
                                progress: 0,
                            };
                        }
                    })
                );

                setCategories(categoriesWithCounts);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, [isAuthenticated]);

    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleTabClick = (tab) => {
        if ((tab === 'progress' || tab === 'activity') && !isAuthenticated) {
            setShowAuthPrompt(true);
            return;
        }

        if (tab === 'progress') {
            navigate('/quiz/progress');
        } else if (tab === 'activity') {
            navigate('/quiz/recent');
        } else {
            setActiveTab(tab);
        }
    };

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
                        {activeTab === 'categories' && (
                            <motion.div
                                key="categories"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h4 className="text-2xl font-bold text-blue-950 mb-4">
                                    Browse Categories
                                </h4>

                                {loading ? (
                                    <div className="flex justify-center items-center py-12">
                                        <LoadingSpinner size="large" />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {filteredCategories.map(
                                            (category, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{
                                                        opacity: 0,
                                                        y: 20,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    transition={{
                                                        delay: index * 0.05,
                                                    }}
                                                    className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                                                >
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div
                                                            className={`${category.color} p-3 rounded-full`}
                                                        >
                                                            {category.icon}
                                                        </div>
                                                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                            {category.questions}{' '}
                                                            Questions
                                                        </span>
                                                    </div>
                                                    <h5 className="text-lg font-bold text-blue-950 mb-3">
                                                        {category.name}
                                                    </h5>

                                                    <div className="mb-4">
                                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                            <span>
                                                                Progress
                                                            </span>
                                                            <span>
                                                                {
                                                                    category.progress
                                                                }
                                                                %
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-orange-400 h-2 rounded-full"
                                                                style={{
                                                                    width: `${category.progress}%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/student/category/${category.id}`
                                                            )
                                                        }
                                                        className="w-full bg-blue-950 text-white py-2 rounded-lg font-medium hover:cursor-pointer hover:bg-orange-400 transition-all shadow-sm"
                                                    >
                                                        View Quizzes
                                                    </button>
                                                </motion.div>
                                            )
                                        )}
                                    </div>
                                )}

                                {!loading &&
                                    filteredCategories.length === 0 && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center"
                                        >
                                            <AlertCircle
                                                className="mx-auto text-gray-400 mb-4"
                                                size={40}
                                            />
                                            <h5 className="text-lg font-medium text-gray-700 mb-2">
                                                No categories found
                                            </h5>
                                            <p className="text-gray-500">
                                                Try adjusting your search or
                                                browse our full catalog.
                                            </p>
                                        </motion.div>
                                    )}
                            </motion.div>
                        )}

                        {activeTab === 'progress' && (
                            <motion.div
                                key="progress"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                        <h5 className="text-gray-500 text-sm font-medium mb-2">
                                            Total Quizzes Taken
                                        </h5>
                                        <p className="text-3xl font-bold text-blue-950">
                                            24
                                        </p>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                        <h5 className="text-gray-500 text-sm font-medium mb-2">
                                            Average Score
                                        </h5>
                                        <p className="text-3xl font-bold text-blue-950">
                                            78%
                                        </p>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                        <h5 className="text-gray-500 text-sm font-medium mb-2">
                                            Current Streak
                                        </h5>
                                        <p className="text-3xl font-bold text-blue-950">
                                            5 days
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h5 className="text-lg font-bold text-blue-950 mb-4">
                                        Progress by Category
                                    </h5>
                                    <div className="space-y-4">
                                        {categories
                                            .slice(0, 5)
                                            .map((category, index) => (
                                                <div
                                                    key={index}
                                                    className="space-y-2"
                                                >
                                                    <div className="flex justify-between">
                                                        <span className="font-medium text-gray-700">
                                                            {category.name}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            {category.progress}%
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-600 h-2 rounded-full"
                                                            style={{
                                                                width: `${category.progress}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'activity' && (
                            <motion.div
                                key="activity"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h5 className="text-lg font-bold text-blue-950 mb-4">
                                    Recent Quiz Activity
                                </h5>
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                    {recentActivities.map((activity, index) => (
                                        <div
                                            key={activity.id}
                                            className={`p-4 ${
                                                index !==
                                                recentActivities.length - 1
                                                    ? 'border-b border-gray-100'
                                                    : ''
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                                                        <BookOpen size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">
                                                            {activity.category}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {activity.date}
                                                        </p>
                                                    </div>
                                                </div>
                                                {activity.status ===
                                                'completed' ? (
                                                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                                        Score: {activity.score}%
                                                    </div>
                                                ) : (
                                                    <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                                                        In Progress
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Authentication Prompt */}
            <AuthPrompt
                isOpen={showAuthPrompt}
                onClose={() => setShowAuthPrompt(false)}
                title="Authentication Required"
                message="Please sign in to access your progress and activity data."
            />
        </div>
    );
}

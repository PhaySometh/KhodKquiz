import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Clock,
    CheckCircle,
    XCircle,
    TrendingUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/common/Navbar';
import QuizHero, { QuizTabs } from '../components/QuizHero';
import AuthPrompt from '../components/AuthPrompt';

const recentActivities = [
    {
        id: 1,
        category: 'JavaScript',
        score: 85,
        date: '2 hours ago',
        status: 'completed',
        questions: 20,
        timeSpent: '12 min',
        difficulty: 'Medium',
    },
    {
        id: 2,
        category: 'Python',
        score: 72,
        date: '1 day ago',
        status: 'completed',
        questions: 15,
        timeSpent: '8 min',
        difficulty: 'Easy',
    },
    {
        id: 3,
        category: 'Web Development',
        score: 91,
        date: '3 days ago',
        status: 'completed',
        questions: 25,
        timeSpent: '18 min',
        difficulty: 'Hard',
    },
    {
        id: 4,
        category: 'Data Science',
        score: null,
        date: 'In progress',
        status: 'active',
        questions: 20,
        timeSpent: '5 min',
        difficulty: 'Medium',
    },
    {
        id: 5,
        category: 'C++',
        score: 67,
        date: '1 week ago',
        status: 'completed',
        questions: 18,
        timeSpent: '15 min',
        difficulty: 'Hard',
    },
    {
        id: 6,
        category: 'General Knowledge',
        score: 94,
        date: '1 week ago',
        status: 'completed',
        questions: 30,
        timeSpent: '22 min',
        difficulty: 'Easy',
    },
];

const QuizRecent = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('activity');
    const [showAuthPrompt, setShowAuthPrompt] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const handleTabClick = (tab) => {
        if ((tab === 'progress' || tab === 'activity') && !isAuthenticated) {
            setShowAuthPrompt(true);
            return;
        }

        if (tab === 'progress') {
            navigate('/quizzes/progress');
        } else if (tab === 'activity') {
            navigate('/quizzes/recent');
        } else {
            navigate('/quizzes');
        }
    };

    const getStatusIcon = (status, score) => {
        if (status === 'active') {
            return <Clock className="text-yellow-500" size={20} />;
        }
        return score >= 80 ? (
            <CheckCircle className="text-green-500" size={20} />
        ) : (
            <XCircle className="text-red-500" size={20} />
        );
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600 bg-green-100';
        if (score >= 60) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy':
                return 'text-green-600 bg-green-100';
            case 'Medium':
                return 'text-yellow-600 bg-yellow-100';
            case 'Hard':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
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

                    {/* Quick Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                    >
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                                    <BookOpen size={24} />
                                </div>
                                <span className="text-2xl font-bold text-gray-900">
                                    6
                                </span>
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium">
                                Quizzes This Week
                            </h3>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-green-100 text-green-600 p-3 rounded-full">
                                    <TrendingUp size={24} />
                                </div>
                                <span className="text-2xl font-bold text-gray-900">
                                    82%
                                </span>
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium">
                                Average This Week
                            </h3>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
                                    <Clock size={24} />
                                </div>
                                <span className="text-2xl font-bold text-gray-900">
                                    80
                                </span>
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium">
                                Minutes Studied
                            </h3>
                        </div>
                    </motion.div>

                    {/* Recent Activities List */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                    >
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">
                                Quiz History
                            </h2>
                        </div>

                        <div className="divide-y divide-gray-200">
                            {recentActivities.map((activity, index) => (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="p-6 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                                                <BookOpen size={20} />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900 mb-1">
                                                    {activity.category}
                                                </h3>
                                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                    <span>
                                                        {activity.questions}{' '}
                                                        questions
                                                    </span>
                                                    <span>•</span>
                                                    <span>
                                                        {activity.timeSpent}
                                                    </span>
                                                    <span>•</span>
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                                                            activity.difficulty
                                                        )}`}
                                                    >
                                                        {activity.difficulty}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500 mb-1">
                                                    {activity.date}
                                                </p>
                                                {activity.status ===
                                                'completed' ? (
                                                    <div
                                                        className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(
                                                            activity.score
                                                        )}`}
                                                    >
                                                        Score: {activity.score}%
                                                    </div>
                                                ) : (
                                                    <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                                                        In Progress
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center">
                                                {getStatusIcon(
                                                    activity.status,
                                                    activity.score
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Authentication Prompt */}
            <AuthPrompt
                isOpen={showAuthPrompt}
                onClose={() => setShowAuthPrompt(false)}
                title="Authentication Required"
                message="Please sign in to access your recent activity data."
            />
        </div>
    );
};

export default QuizRecent;

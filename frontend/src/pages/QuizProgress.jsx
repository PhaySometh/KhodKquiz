import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Calendar, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/common/Navbar';
import QuizHero, { QuizTabs } from '../components/QuizHero';
import AuthPrompt from '../components/AuthPrompt';

const categories = [
    {
        name: 'JavaScript',
        questions: 125,
        color: 'bg-yellow-100 text-yellow-600',
        progress: 65,
    },
    {
        name: 'Python',
        questions: 89,
        color: 'bg-blue-100 text-blue-600',
        progress: 42,
    },
    {
        name: 'C++',
        questions: 76,
        color: 'bg-purple-100 text-purple-600',
        progress: 28,
    },
    {
        name: 'Web Development',
        questions: 112,
        color: 'bg-green-100 text-green-600',
        progress: 83,
    },
    {
        name: 'Data Science',
        questions: 54,
        color: 'bg-red-100 text-red-600',
        progress: 37,
    },
    {
        name: 'General Knowledge',
        questions: 210,
        color: 'bg-indigo-100 text-indigo-600',
        progress: 91,
    },
    {
        name: 'Language Translation',
        questions: 67,
        color: 'bg-pink-100 text-pink-600',
        progress: 19,
    },
    {
        name: 'Science',
        questions: 98,
        color: 'bg-cyan-100 text-cyan-600',
        progress: 56,
    },
    {
        name: 'History',
        questions: 45,
        color: 'bg-amber-100 text-amber-600',
        progress: 32,
    },
];

const QuizProgress = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('progress');
    const [showAuthPrompt, setShowAuthPrompt] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

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
            navigate('/quiz/category');
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

                    {/* Stats Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
                    >
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                                    <Target size={24} />
                                </div>
                                <span className="text-2xl font-bold text-gray-900">
                                    24
                                </span>
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium">
                                Total Quizzes Taken
                            </h3>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-green-100 text-green-600 p-3 rounded-full">
                                    <TrendingUp size={24} />
                                </div>
                                <span className="text-2xl font-bold text-gray-900">
                                    78%
                                </span>
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium">
                                Average Score
                            </h3>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-orange-100 text-orange-600 p-3 rounded-full">
                                    <Calendar size={24} />
                                </div>
                                <span className="text-2xl font-bold text-gray-900">
                                    5
                                </span>
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium">
                                Current Streak (days)
                            </h3>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
                                    <Award size={24} />
                                </div>
                                <span className="text-2xl font-bold text-gray-900">
                                    12
                                </span>
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium">
                                Badges Earned
                            </h3>
                        </div>
                    </motion.div>

                    {/* Progress by Category */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                    >
                        <h2 className="text-xl font-bold text-gray-900 mb-6">
                            Progress by Category
                        </h2>
                        <div className="space-y-6">
                            {categories.map((category, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="space-y-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`${category.color} p-2 rounded-lg`}
                                            >
                                                <Target size={16} />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">
                                                    {category.name}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {category.questions}{' '}
                                                    questions available
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-bold text-gray-900">
                                                {category.progress}%
                                            </span>
                                            <p className="text-sm text-gray-500">
                                                completed
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <motion.div
                                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: `${category.progress}%`,
                                            }}
                                            transition={{
                                                duration: 1,
                                                delay: index * 0.1,
                                            }}
                                        />
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
                message="Please sign in to access your progress data."
            />
        </div>
    );
};

export default QuizProgress;

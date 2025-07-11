import React, { useState } from 'react';
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

const categories = [
    {
        name: 'JavaScript',
        icon: <Code />,
        questions: 125,
        color: 'bg-yellow-100 text-yellow-600',
        progress: 65,
    },
    {
        name: 'Python',
        icon: <BookOpen />,
        questions: 89,
        color: 'bg-blue-100 text-blue-600',
        progress: 42,
    },
    {
        name: 'C++',
        icon: <Cpu />,
        questions: 76,
        color: 'bg-purple-100 text-purple-600',
        progress: 28,
    },
    {
        name: 'Web Development',
        icon: <Globe />,
        questions: 112,
        color: 'bg-green-100 text-green-600',
        progress: 83,
    },
    {
        name: 'Data Science',
        icon: <Database />,
        questions: 54,
        color: 'bg-red-100 text-red-600',
        progress: 37,
    },
    {
        name: 'General Knowledge',
        icon: <Brain />,
        questions: 210,
        color: 'bg-indigo-100 text-indigo-600',
        progress: 91,
    },
    {
        name: 'Language Translation',
        icon: <Languages />,
        questions: 67,
        color: 'bg-pink-100 text-pink-600',
        progress: 19,
    },
    {
        name: 'Science',
        icon: <FlaskConical />,
        questions: 98,
        color: 'bg-cyan-100 text-cyan-600',
        progress: 56,
    },
    {
        name: 'History',
        icon: <ScrollText />,
        questions: 45,
        color: 'bg-amber-100 text-amber-600',
        progress: 32,
    },
];

const recentActivities = [
    {
        id: 1,
        category: 'JavaScript',
        score: 85,
        date: '2 hours ago',
        status: 'completed',
    },
    {
        id: 2,
        category: 'Python',
        score: 72,
        date: '1 day ago',
        status: 'completed',
    },
    {
        id: 3,
        category: 'Web Development',
        score: 91,
        date: '3 days ago',
        status: 'completed',
    },
    {
        id: 4,
        category: 'Data Science',
        score: null,
        date: 'In progress',
        status: 'active',
    },
];

export default function QuizCategory() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('categories');
    const [showAuthPrompt, setShowAuthPrompt] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {filteredCategories.map(
                                        (category, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
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
                                                        <span>Progress</span>
                                                        <span>
                                                            {category.progress}%
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
                                                        navigate(`/quiz/${id}`)
                                                    }
                                                    className="w-full bg-blue-950 text-white py-2 rounded-lg font-medium hover:cursor-pointer hover:bg-orange-400 transition-all shadow-sm"
                                                >
                                                    Start Quiz
                                                </button>
                                            </motion.div>
                                        )
                                    )}
                                </div>

                                {filteredCategories.length === 0 && (
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
                                            Try adjusting your search or browse
                                            our full catalog.
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

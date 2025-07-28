import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UserNavbar from '../../../components/common/UserNavbar';
import {
    Code,
    Languages,
    Brain,
    Search,
    ChevronRight,
    BookOpen,
    Database,
    Cpu,
    Globe,
    FlaskConical,
    ScrollText,
    AlertCircle,
    Bell,
    User,
    Settings,
} from 'lucide-react';
import StudentSidebar from '../../../components/client/student/StudentSidebar';
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';
import toast from 'react-hot-toast';

import { Link, useNavigate } from 'react-router-dom';

/**
 * Student Dashboard Component
 *
 * Displays student progress, recent activities, and performance metrics.
 * Recent activities are now fetched from the API in QuizRecent component.
 * This component focuses on overview statistics and navigation.
 */

const BASE_URL = 'http://localhost:3000';

export default function StudentDashBoard() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('categories');
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [progressData, setProgressData] = useState(null);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(
                    `${BASE_URL}/api/student/categories`
                );
                if (response.data.success) {
                    setCategories(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    // Fetch progress data when authenticated and progress tab is active
    useEffect(() => {
        const fetchProgressData = async () => {
            if (!isAuthenticated || activeTab !== 'progress') return;

            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(
                    `${BASE_URL}/api/student/progress`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (response.data.success) {
                    setProgressData(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching progress data:', error);
                toast.error('Failed to load progress data');
            } finally {
                setLoading(false);
            }
        };

        fetchProgressData();
    }, [isAuthenticated, activeTab]);

    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <StudentSidebar />

            <div className="w-full overflow-y-auto">
                {/* Header */}
                <UserNavbar />

                <main className="p-6">
                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative w-full flex flex-col items-center justify-center p-8 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 mb-8"
                    >
                        <h3 className="text-3xl md:text-4xl text-blue-950 font-bold text-center mb-2">
                            What will you learn today?
                        </h3>
                        <p className="text-gray-600 text-center mb-6 max-w-2xl">
                            Choose from hundreds of quizzes to test your
                            knowledge and learn new skills.
                        </p>

                        <div className="relative w-full max-w-2xl">
                            <div className="bg-white px-4 py-3 flex items-center rounded-full w-full justify-between shadow-md hover:shadow-lg transition-shadow">
                                <Search className="text-gray-400" size={20} />
                                <input
                                    className="text-blue-950 w-full outline-none ml-3 placeholder-gray-400"
                                    placeholder="Search for any topic or language..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full p-2 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md">
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 mb-6">
                        <button
                            className={`px-4 py-2 font-medium text-sm ${
                                activeTab === 'categories'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setActiveTab('categories')}
                        >
                            Categories
                        </button>
                        <button
                            className={`px-4 py-2 font-medium text-sm ${
                                activeTab === 'progress'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setActiveTab('progress')}
                        >
                            My Progress
                        </button>
                        <button
                            className={`px-4 py-2 font-medium text-sm ${
                                activeTab === 'activity'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setActiveTab('activity')}
                        >
                            Recent Activity
                        </button>
                    </div>

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
                                                    {/* <div className={`${category.color} p-3 rounded-full`}>
                                                    {category.icon}
                                                </div> */}
                                                    {/* <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                    {category.questions} Questions
                                                </span> */}
                                                </div>
                                                <h5 className="text-lg font-bold text-blue-950 mb-3">
                                                    {category.name}
                                                </h5>
                                                <p className="text-sm text-gray-500 mb-4">
                                                    {category.description}
                                                </p>

                                                {/* <div className="mb-4">
                                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                    <span>Progress</span>
                                                    <span>{category.progress}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className="bg-blue-600 h-2 rounded-full" 
                                                        style={{ width: `${category.progress}%` }}
                                                    ></div>
                                                </div>
                                            </div> */}

                                                <Link
                                                    to={`/student/category/${category.id}`}
                                                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
                                                >
                                                    View Quizzes
                                                </Link>
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
                                {loading ? (
                                    <div className="flex justify-center items-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        <span className="ml-3 text-gray-600">
                                            Loading progress data...
                                        </span>
                                    </div>
                                ) : progressData ? (
                                    <>
                                        {/* Statistics Cards */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                                <h5 className="text-gray-500 text-sm font-medium mb-2">
                                                    Total Quizzes Taken
                                                </h5>
                                                <p className="text-3xl font-bold text-blue-950">
                                                    {
                                                        progressData.statistics
                                                            .totalQuizzes
                                                    }
                                                </p>
                                            </div>
                                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                                <h5 className="text-gray-500 text-sm font-medium mb-2">
                                                    Average Score
                                                </h5>
                                                <p className="text-3xl font-bold text-blue-950">
                                                    {
                                                        progressData.statistics
                                                            .averageScore
                                                    }
                                                </p>
                                            </div>
                                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                                <h5 className="text-gray-500 text-sm font-medium mb-2">
                                                    Average Accuracy
                                                </h5>
                                                <p className="text-3xl font-bold text-blue-950">
                                                    {
                                                        progressData.statistics
                                                            .averageAccuracy
                                                    }
                                                    %
                                                </p>
                                            </div>
                                        </div>

                                        {/* Main Category Progress */}
                                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                            <h5 className="text-lg font-bold text-blue-950 mb-6">
                                                Progress by Main Category
                                            </h5>
                                            <div className="space-y-6">
                                                {Object.entries(
                                                    progressData.categoryProgress
                                                ).map(
                                                    ([
                                                        mainCategory,
                                                        categoryData,
                                                    ]) => (
                                                        <div
                                                            key={mainCategory}
                                                            className="space-y-3"
                                                        >
                                                            <div className="flex justify-between items-center">
                                                                <div>
                                                                    <span className="font-semibold text-gray-800 text-lg">
                                                                        {
                                                                            mainCategory
                                                                        }
                                                                    </span>
                                                                    <p className="text-sm text-gray-500">
                                                                        {
                                                                            categoryData.completedQuizzes
                                                                        }{' '}
                                                                        of{' '}
                                                                        {
                                                                            categoryData.totalQuizzes
                                                                        }{' '}
                                                                        quizzes
                                                                        completed
                                                                    </p>
                                                                </div>
                                                                <span className="text-lg font-bold text-blue-600">
                                                                    {
                                                                        categoryData.progress
                                                                    }
                                                                    %
                                                                </span>
                                                            </div>
                                                            <div className="w-full bg-gray-200 rounded-full h-3">
                                                                <div
                                                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                                                                    style={{
                                                                        width: `${categoryData.progress}%`,
                                                                    }}
                                                                ></div>
                                                            </div>

                                                            {/* Subcategories */}
                                                            {Object.keys(
                                                                categoryData.subcategories
                                                            ).length > 0 && (
                                                                <div className="ml-4 mt-3 space-y-2">
                                                                    {Object.entries(
                                                                        categoryData.subcategories
                                                                    ).map(
                                                                        ([
                                                                            subName,
                                                                            subData,
                                                                        ]) => (
                                                                            <div
                                                                                key={
                                                                                    subName
                                                                                }
                                                                                className="flex justify-between items-center text-sm"
                                                                            >
                                                                                <span
                                                                                    className={`${
                                                                                        subData.completed
                                                                                            ? 'text-green-600'
                                                                                            : 'text-gray-500'
                                                                                    }`}
                                                                                >
                                                                                    {subData.completed
                                                                                        ? '✓'
                                                                                        : '○'}{' '}
                                                                                    {
                                                                                        subName
                                                                                    }
                                                                                </span>
                                                                                {subData.completed && (
                                                                                    <span className="text-green-600 font-medium">
                                                                                        {
                                                                                            subData.bestAccuracy
                                                                                        }

                                                                                        %
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        {/* Recent Results */}
                                        {progressData.recentResults.length >
                                            0 && (
                                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                                <h5 className="text-lg font-bold text-blue-950 mb-4">
                                                    Recent Quiz Results
                                                </h5>
                                                <div className="space-y-3">
                                                    {progressData.recentResults
                                                        .slice(0, 5)
                                                        .map((result) => (
                                                            <div
                                                                key={result.id}
                                                                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                                                            >
                                                                <div>
                                                                    <span className="font-medium text-gray-800">
                                                                        {
                                                                            result.quizTitle
                                                                        }
                                                                    </span>
                                                                    <p className="text-sm text-gray-500">
                                                                        {
                                                                            result.category
                                                                        }{' '}
                                                                        •{' '}
                                                                        {new Date(
                                                                            result.takenAt
                                                                        ).toLocaleDateString()}
                                                                    </p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="font-bold text-blue-600">
                                                                        {
                                                                            result.score
                                                                        }{' '}
                                                                        pts
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {
                                                                            result.accuracy
                                                                        }
                                                                        %
                                                                        accuracy
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="text-gray-500 mb-4">
                                            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                            <p className="text-lg font-medium">
                                                No progress data available
                                            </p>
                                            <p className="text-sm">
                                                Complete some quizzes to see
                                                your progress!
                                            </p>
                                        </div>
                                    </div>
                                )}
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
                </main>
            </div>
        </div>
    );
}

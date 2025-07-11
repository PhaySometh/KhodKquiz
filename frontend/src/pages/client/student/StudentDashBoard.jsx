import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UserNavbar from "../../../components/common/UserNavbar";
import { Code, Languages, Brain, Search, ChevronRight, BookOpen, Database, Cpu, Globe, FlaskConical, ScrollText, AlertCircle, Bell, User, Settings } from 'lucide-react';
import StudentSidebar from '../../../components/client/student/StudentSidebar';

import { useNavigate } from 'react-router-dom';

const categories = [
    { name: 'JavaScript', icon: <Code />, questions: 125, color: 'bg-yellow-100 text-yellow-600', progress: 65 },
    { name: 'Python', icon: <BookOpen />, questions: 89, color: 'bg-blue-100 text-blue-600', progress: 42 },
    { name: 'C++', icon: <Cpu />, questions: 76, color: 'bg-purple-100 text-purple-600', progress: 28 },
    { name: 'Web Development', icon: <Globe />, questions: 112, color: 'bg-green-100 text-green-600', progress: 83 },
    { name: 'Data Science', icon: <Database />, questions: 54, color: 'bg-red-100 text-red-600', progress: 37 },
    { name: 'General Knowledge', icon: <Brain />, questions: 210, color: 'bg-indigo-100 text-indigo-600', progress: 91 },
    { name: 'Language Translation', icon: <Languages />, questions: 67, color: 'bg-pink-100 text-pink-600', progress: 19 },
    { name: 'Science', icon: <FlaskConical />, questions: 98, color: 'bg-cyan-100 text-cyan-600', progress: 56 },
    { name: 'History', icon: <ScrollText />, questions: 45, color: 'bg-amber-100 text-amber-600', progress: 32 },
];

const recentActivities = [
    { id: 1, category: 'JavaScript', score: 85, date: '2 hours ago', status: 'completed' },
    { id: 2, category: 'Python', score: 72, date: '1 day ago', status: 'completed' },
    { id: 3, category: 'Web Development', score: 91, date: '3 days ago', status: 'completed' },
    { id: 4, category: 'Data Science', score: null, date: 'In progress', status: 'active' },
];

export default function StudentDashBoard() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('categories');
    const navigate = useNavigate();

    const filteredCategories = categories.filter(category =>
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
                            Choose from hundreds of quizzes to test your knowledge and learn new skills.
                        </p>
                        
                        <div className="relative w-full max-w-2xl">
                            <div className="bg-white px-4 py-3 flex items-center rounded-full w-full justify-between shadow-md hover:shadow-lg transition-shadow">
                                <Search className="text-gray-400" size={20} />
                                <input
                                    className="text-blue-950 w-full outline-none ml-3 placeholder-gray-400"
                                    placeholder="Search for any topic or language..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
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
                            className={`px-4 py-2 font-medium text-sm ${activeTab === 'categories' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('categories')}
                        >
                            Categories
                        </button>
                        <button
                            className={`px-4 py-2 font-medium text-sm ${activeTab === 'progress' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('progress')}
                        >
                            My Progress
                        </button>
                        <button
                            className={`px-4 py-2 font-medium text-sm ${activeTab === 'activity' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
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
                                <h4 className="text-2xl font-bold text-blue-950 mb-4">Browse Categories</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {filteredCategories.map((category, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className={`${category.color} p-3 rounded-full`}>
                                                    {category.icon}
                                                </div>
                                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                    {category.questions} Questions
                                                </span>
                                            </div>
                                            <h5 className="text-lg font-bold text-blue-950 mb-3">{category.name}</h5>
                                            
                                            <div className="mb-4">
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
                                            </div>
                                            
                                            <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
                                                onClick={() => navigate(`/quiz/1`)}>
                                                Start Quiz
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                                
                                {filteredCategories.length === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center"
                                    >
                                        <AlertCircle className="mx-auto text-gray-400 mb-4" size={40} />
                                        <h5 className="text-lg font-medium text-gray-700 mb-2">No categories found</h5>
                                        <p className="text-gray-500">Try adjusting your search or browse our full catalog.</p>
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
                                        <h5 className="text-gray-500 text-sm font-medium mb-2">Total Quizzes Taken</h5>
                                        <p className="text-3xl font-bold text-blue-950">24</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                        <h5 className="text-gray-500 text-sm font-medium mb-2">Average Score</h5>
                                        <p className="text-3xl font-bold text-blue-950">78%</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                        <h5 className="text-gray-500 text-sm font-medium mb-2">Current Streak</h5>
                                        <p className="text-3xl font-bold text-blue-950">5 days</p>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h5 className="text-lg font-bold text-blue-950 mb-4">Progress by Category</h5>
                                    <div className="space-y-4">
                                        {categories.slice(0, 5).map((category, index) => (
                                            <div key={index} className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-700">{category.name}</span>
                                                    <span className="text-sm text-gray-500">{category.progress}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className="bg-blue-600 h-2 rounded-full" 
                                                        style={{ width: `${category.progress}%` }}
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
                                <h5 className="text-lg font-bold text-blue-950 mb-4">Recent Quiz Activity</h5>
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                    {recentActivities.map((activity, index) => (
                                        <div 
                                            key={activity.id} 
                                            className={`p-4 ${index !== recentActivities.length - 1 ? 'border-b border-gray-100' : ''}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                                                        <BookOpen size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">{activity.category}</p>
                                                        <p className="text-sm text-gray-500">{activity.date}</p>
                                                    </div>
                                                </div>
                                                {activity.status === 'completed' ? (
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
};
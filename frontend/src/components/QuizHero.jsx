import React from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Shared Hero Component for Quiz Pages
 * Provides consistent layout across /quiz/category, /quiz/progress, and /quiz/recent
 * @param {string} searchQuery - Current search query value
 * @param {function} setSearchQuery - Function to update search query
 * @param {string} activeTab - Currently active tab ('categories', 'progress', 'activity')
 * @param {function} handleTabClick - Function to handle tab clicks with authentication logic
 */
const QuizHero = ({
    searchQuery,
    setSearchQuery,
    activeTab,
    handleTabClick,
}) => {
    const { isAuthenticated } = useAuth();

    return (
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
                Choose from hundreds of quizzes to test your knowledge and learn
                new skills.
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
                    <button className="bg-gradient-to-r from-blue-950 to-blue-800 text-white rounded-full p-2 hover:from-blue-800 hover:to-blue-700 transition-all shadow-md">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

/**
 * Shared Tab Navigation Component
 * Provides consistent tab navigation across quiz pages
 * @param {string} activeTab - Currently active tab
 * @param {function} handleTabClick - Function to handle tab clicks
 */
export const QuizTabs = ({ activeTab, handleTabClick }) => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="flex border-b border-gray-200 mb-6">
            <button
                className={`px-4 py-2 font-medium text-smc hover:cursor-pointer ${
                    activeTab === 'categories'
                        ? 'text-blue-950 border-b-2 border-blue-950'
                        : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => handleTabClick('categories')}
            >
                Categories
            </button>
            <button
                className={`px-4 py-2 font-medium text-sm relative hover:cursor-pointer ${
                    activeTab === 'progress'
                        ? 'text-blue-950 border-b-2 border-blue-950'
                        : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => handleTabClick('progress')}
            >
                My Progress
                {!isAuthenticated && (
                    <span className="ml-1 text-xs text-orange-500">🔒</span>
                )}
            </button>
            <button
                className={`px-4 py-2 font-medium text-sm relative hover:cursor-pointer ${
                    activeTab === 'activity'
                        ? 'text-blue-950 border-b-2 border-blue-950'
                        : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => handleTabClick('activity')}
            >
                Recent Activity
                {!isAuthenticated && (
                    <span className="ml-1 text-xs text-orange-500">🔒</span>
                )}
            </button>
        </div>
    );
};

export default QuizHero;

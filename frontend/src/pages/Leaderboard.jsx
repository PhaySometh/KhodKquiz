import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import ProfilePicture from '../components/ProfilePicture';
import LoadingSpinner from '../components/LoadingSpinner';
import apiClient from '../utils/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trophy,
    Crown,
    Star,
    Award,
    ChevronDown,
    ChevronUp,
    RotateCw,
} from 'lucide-react';

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({
        key: 'score',
        direction: 'desc',
    });
    const [expandedUser, setExpandedUser] = useState(null);
    const [mobileColumn, setMobileColumn] = useState('score'); // For mobile column selector

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            // Add a minimum loading time for better UX
            const [response] = await Promise.all([
                apiClient.get('/api/public/leaderboard'),
                new Promise((resolve) => setTimeout(resolve, 1000)), // Minimum 1 second loading
            ]);
            setLeaderboard(response.data.data || []);
        } catch (error) {
            console.error('Error Fetching leaderboard: ', error);
            setLeaderboard([]);
        } finally {
            setLoading(false);
        }
    };

    const sortLeaderboard = (key) => {
        // Don't allow sorting by score as it should always be highest first
        if (key === 'score') return;

        let direction = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });

        const sorted = [...leaderboard].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        setLeaderboard(sorted);
    };

    const toggleUserDetails = (id) => {
        setExpandedUser(expandedUser === id ? null : id);
    };

    const renderMedal = (rank) => {
        if (rank === 1) return <Crown className="text-yellow-400" size={24} />;
        if (rank === 2) return <Trophy className="text-gray-300" size={20} />;
        if (rank === 3) return <Award className="text-amber-600" size={20} />;
        return <span className="font-medium text-white">{rank}</span>;
    };

    const getRankColor = (rank) => {
        if (rank === 1)
            return 'bg-gradient-to-r from-yellow-500 to-yellow-600 border-yellow-300';
        if (rank === 2)
            return 'bg-gradient-to-r from-gray-500 to-gray-600 border-gray-300';
        if (rank === 3)
            return 'bg-gradient-to-r from-amber-700 to-amber-800 border-amber-500';
        if (rank <= 5)
            return 'bg-gradient-to-r from-purple-600 to-purple-700 border-purple-400';
        if (rank <= 10)
            return 'bg-gradient-to-r from-blue-600 to-blue-700 border-blue-400';
        return 'bg-gradient-to-r from-gray-700 to-gray-800 border-gray-600';
    };

    const [isRefreshing, setIsRefreshing] = useState(false);

    const refreshLeaderboard = async () => {
        setIsRefreshing(true);
        try {
            await fetchLeaderboard();
        } finally {
            setIsRefreshing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
                <Navbar />
                <div className="flex justify-center items-center pt-32">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                        <LoadingSpinner
                            size="xl"
                            text="Loading leaderboard..."
                            variant="quiz"
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pb-20">
            <Navbar />

            <div className="container mx-auto px-4 py-8 mt-16">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                        Quiz Champions
                    </h1>
                    <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
                        See where you stand among the best quiz takers. The
                        fastest and most accurate rise to the top!
                    </p>

                    <motion.button
                        onClick={refreshLeaderboard}
                        disabled={isRefreshing || loading}
                        whileHover={{ scale: isRefreshing ? 1 : 1.05 }}
                        whileTap={{ scale: isRefreshing ? 1 : 0.95 }}
                        className="mt-6 bg-blue-950 hover:bg-blue-800 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 mx-auto transition-colors"
                    >
                        {isRefreshing ? (
                            <LoadingSpinner size="sm" text="" variant="dots" />
                        ) : (
                            <RotateCw size={18} />
                        )}
                        {isRefreshing ? 'Refreshing...' : 'Refresh Leaderboard'}
                    </motion.button>
                </motion.div>

                {/* Podium Section */}
                {leaderboard.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto mb-12 px-4"
                    >
                        {/* 1st Place - Center (Mobile: First, Desktop: Middle) */}
                        {leaderboard[0] && (
                            <motion.div
                                key={leaderboard[0].id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className={`flex flex-col items-center p-4 md:p-6 rounded-2xl border-2 min-h-[280px] md:min-h-[320px] ${getRankColor(
                                    1
                                )} shadow-xl order-1 md:order-2 md:self-end w-full max-w-sm mx-auto`}
                            >
                                <div className="text-4xl md:text-5xl font-bold text-white mb-3 md:mb-4">
                                    1
                                </div>
                                <ProfilePicture
                                    user={leaderboard[0]}
                                    size="lg"
                                    className="mb-3 md:mb-4 flex-shrink-0"
                                />
                                <div className="text-center w-full px-2">
                                    <h3
                                        className="text-lg md:text-xl font-bold text-white mb-1 truncate w-full"
                                        title={leaderboard[0].username}
                                    >
                                        {leaderboard[0].username}
                                    </h3>
                                    <div className="flex items-center justify-center gap-2 text-white mb-2">
                                        <Trophy
                                            size={16}
                                            className="flex-shrink-0"
                                        />
                                        <span className="font-bold text-sm md:text-base">
                                            {leaderboard[0].score} points
                                        </span>
                                    </div>
                                    <div className="text-xs text-white/80 break-words">
                                        {leaderboard[0].quizzesTaken} quizzes •{' '}
                                        {leaderboard[0].accuracy}% accuracy
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* 2nd Place - Left (Mobile: Second, Desktop: Left) */}
                        {leaderboard[1] && (
                            <motion.div
                                key={leaderboard[1].id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className={`flex flex-col items-center p-4 md:p-6 rounded-2xl border-2 min-h-[260px] md:min-h-[280px] ${getRankColor(
                                    2
                                )} shadow-xl order-2 md:order-1 md:self-end w-full max-w-sm mx-auto`}
                            >
                                <div className="text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
                                    2
                                </div>
                                <ProfilePicture
                                    user={leaderboard[1]}
                                    size="lg"
                                    className="mb-3 md:mb-4 flex-shrink-0"
                                />
                                <div className="text-center w-full px-2">
                                    <h3
                                        className="text-base md:text-lg font-bold text-white mb-1 truncate w-full"
                                        title={leaderboard[1].username}
                                    >
                                        {leaderboard[1].username}
                                    </h3>
                                    <div className="flex items-center justify-center gap-2 text-white mb-2">
                                        <Trophy
                                            size={14}
                                            className="flex-shrink-0"
                                        />
                                        <span className="font-bold text-sm">
                                            {leaderboard[1].score} points
                                        </span>
                                    </div>
                                    <div className="text-xs text-white/80 break-words">
                                        {leaderboard[1].quizzesTaken} quizzes •{' '}
                                        {leaderboard[1].accuracy}% accuracy
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* 3rd Place - Right (Mobile: Third, Desktop: Right) */}
                        {leaderboard[2] && (
                            <motion.div
                                key={leaderboard[2].id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                className={`flex flex-col items-center p-4 md:p-6 rounded-2xl border-2 min-h-[240px] md:min-h-[260px] ${getRankColor(
                                    3
                                )} shadow-xl order-3 md:self-end w-full max-w-sm mx-auto`}
                            >
                                <div className="text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
                                    3
                                </div>
                                <ProfilePicture
                                    user={leaderboard[2]}
                                    size="lg"
                                    className="mb-3 md:mb-4 flex-shrink-0"
                                />
                                <div className="text-center w-full px-2">
                                    <h3
                                        className="text-base md:text-lg font-bold text-white mb-1 truncate w-full"
                                        title={leaderboard[2].username}
                                    >
                                        {leaderboard[2].username}
                                    </h3>
                                    <div className="flex items-center justify-center gap-2 text-white mb-2">
                                        <Trophy
                                            size={14}
                                            className="flex-shrink-0"
                                        />
                                        <span className="font-bold text-sm">
                                            {leaderboard[2].score} points
                                        </span>
                                    </div>
                                    <div className="text-xs text-white/80 break-words">
                                        {leaderboard[2].quizzesTaken} quizzes •{' '}
                                        {leaderboard[2].accuracy}% accuracy
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* Leaderboard Table */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 shadow-xl overflow-hidden"
                >
                    {/* Mobile Column Selector */}
                    <div className="sm:hidden bg-gray-900/80 p-3 border-b border-gray-700">
                        <label className="block text-xs font-medium text-gray-300 mb-2">
                            Additional Column:
                        </label>
                        <select
                            value={mobileColumn}
                            onChange={(e) => setMobileColumn(e.target.value)}
                            className="w-full bg-gray-700 text-white rounded-md px-2 py-1.5 text-xs border border-gray-600 focus:border-blue-500 focus:outline-none"
                        >
                            <option value="score">Score</option>
                            <option value="accuracy">Accuracy</option>
                            <option value="quizzes">Quizzes</option>
                        </select>
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-900/80 text-gray-300">
                                    <th className="px-6 py-4 text-center text-sm font-medium uppercase tracking-wider">
                                        Rank
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-medium uppercase tracking-wider">
                                        Score
                                    </th>
                                    <th
                                        className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider cursor-pointer hover:bg-gray-800/50"
                                        onClick={() =>
                                            sortLeaderboard('accuracy')
                                        }
                                    >
                                        <div className="flex items-center gap-1">
                                            Accuracy
                                            {sortConfig.key === 'accuracy' &&
                                                (sortConfig.direction ===
                                                'asc' ? (
                                                    <ChevronUp size={16} />
                                                ) : (
                                                    <ChevronDown size={16} />
                                                ))}
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-4 text-center text-sm font-medium uppercase tracking-wider cursor-pointer hover:bg-gray-800/50"
                                        onClick={() =>
                                            sortLeaderboard('quizzesTaken')
                                        }
                                    >
                                        <div className="flex items-center justify-center gap-1">
                                            Quizzes
                                            {sortConfig.key ===
                                                'quizzesTaken' &&
                                                (sortConfig.direction ===
                                                'asc' ? (
                                                    <ChevronUp size={16} />
                                                ) : (
                                                    <ChevronDown size={16} />
                                                ))}
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/50">
                                {leaderboard.length > 0 ? (
                                    leaderboard.map((user, index) => (
                                        <React.Fragment key={user.id}>
                                            <motion.tr
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    duration: 0.3,
                                                    delay: 0.1 * index,
                                                }}
                                                className={`hover:bg-gray-700/30 cursor-pointer ${
                                                    index < 3
                                                        ? 'bg-gray-800/30'
                                                        : ''
                                                }`}
                                                onClick={() =>
                                                    toggleUserDetails(user.id)
                                                }
                                            >
                                                {/* Rank Column */}
                                                <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                                    <div className="flex justify-center">
                                                        {renderMedal(index + 1)}
                                                    </div>
                                                </td>

                                                {/* User Column */}
                                                <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <ProfilePicture
                                                            user={user}
                                                            size="md"
                                                            className="mr-2 sm:mr-3 flex-shrink-0"
                                                        />
                                                        <div className="min-w-0 flex-1">
                                                            <span
                                                                className={`text-white truncate block ${
                                                                    index < 3
                                                                        ? 'font-bold'
                                                                        : ''
                                                                }`}
                                                                title={
                                                                    user.username
                                                                }
                                                            >
                                                                {user.username}
                                                            </span>
                                                        </div>
                                                        {index < 3 && (
                                                            <Star
                                                                size={16}
                                                                className={`ml-2 flex-shrink-0 ${
                                                                    index === 0
                                                                        ? 'text-yellow-400'
                                                                        : index ===
                                                                          1
                                                                        ? 'text-gray-300'
                                                                        : 'text-amber-600'
                                                                }`}
                                                                fill="currentColor"
                                                            />
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Desktop Columns */}
                                                <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap font-medium text-white text-center">
                                                    {user.score}
                                                </td>
                                                <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-16 bg-gray-700 rounded-full h-2">
                                                            <div
                                                                className="bg-green-500 h-2 rounded-full"
                                                                style={{
                                                                    width: `${user.accuracy}%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-white">
                                                            {user.accuracy}%
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-white text-center">
                                                    {user.quizzesTaken}
                                                </td>

                                                {/* Mobile Additional Column */}
                                                <td className="sm:hidden px-3 py-4 whitespace-nowrap text-center">
                                                    {mobileColumn ===
                                                        'score' && (
                                                        <span className="font-medium text-white">
                                                            {user.score}
                                                        </span>
                                                    )}
                                                    {mobileColumn ===
                                                        'accuracy' && (
                                                        <div className="flex flex-col items-center gap-1">
                                                            <div className="w-12 bg-gray-700 rounded-full h-1.5">
                                                                <div
                                                                    className="bg-green-500 h-1.5 rounded-full"
                                                                    style={{
                                                                        width: `${user.accuracy}%`,
                                                                    }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-white text-xs">
                                                                {user.accuracy}%
                                                            </span>
                                                        </div>
                                                    )}
                                                    {mobileColumn ===
                                                        'quiz/category' && (
                                                        <span className="text-white">
                                                            {user.quizzesTaken}
                                                        </span>
                                                    )}
                                                </td>
                                            </motion.tr>

                                            <AnimatePresence>
                                                {expandedUser === user.id && (
                                                    <motion.tr
                                                        initial={{
                                                            opacity: 0,
                                                            height: 0,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            height: 'auto',
                                                        }}
                                                        exit={{
                                                            opacity: 0,
                                                            height: 0,
                                                        }}
                                                        className="bg-gray-800/50"
                                                    >
                                                        <td
                                                            colSpan="5"
                                                            className="px-6 py-4"
                                                        >
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                                                                <div className="bg-gray-900/50 p-4 rounded-lg">
                                                                    <h4 className="text-gray-400 text-sm mb-2">
                                                                        Recent
                                                                        Activity
                                                                    </h4>
                                                                    <p className="text-sm text-white">
                                                                        5
                                                                        quizzes
                                                                        in the
                                                                        last
                                                                        week
                                                                    </p>
                                                                </div>
                                                                <div className="bg-gray-900/50 p-4 rounded-lg">
                                                                    <h4 className="text-gray-400 text-sm mb-2">
                                                                        Streak
                                                                    </h4>
                                                                    <p className="text-sm text-white">
                                                                        <span className="font-bold text-yellow-400 ">
                                                                            8
                                                                            days
                                                                        </span>{' '}
                                                                        active
                                                                        streak
                                                                    </p>
                                                                </div>
                                                                <div className="bg-gray-900/50 p-4 rounded-lg">
                                                                    <h4 className="text-gray-400 text-sm mb-2">
                                                                        Achievements
                                                                    </h4>
                                                                    <div className="flex gap-2">
                                                                        <div className="bg-yellow-500/20 p-2 rounded">
                                                                            <Trophy
                                                                                size={
                                                                                    16
                                                                                }
                                                                                className="text-yellow-400"
                                                                            />
                                                                        </div>
                                                                        <div className="bg-blue-500/20 p-2 rounded">
                                                                            <Star
                                                                                size={
                                                                                    16
                                                                                }
                                                                                className="text-blue-400"
                                                                            />
                                                                        </div>
                                                                        <div className="bg-green-500/20 p-2 rounded">
                                                                            <Award
                                                                                size={
                                                                                    16
                                                                                }
                                                                                className="text-green-400"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                )}
                                            </AnimatePresence>
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="text-center py-16 text-gray-500"
                                        >
                                            <div className="flex flex-col items-center">
                                                <Trophy
                                                    size={48}
                                                    className="text-gray-600 mb-4"
                                                />
                                                <h3 className="text-xl font-medium mb-2">
                                                    Leaderboard is empty
                                                </h3>
                                                <p className="max-w-md">
                                                    Be the first to take a quiz
                                                    and claim your spot at the
                                                    top!
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Layout */}
                    <div className="sm:hidden">
                        {leaderboard.length > 0 ? (
                            <div className="divide-y divide-gray-700/50">
                                {leaderboard.map((user, index) => (
                                    <motion.div
                                        key={user.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: 0.1 * index,
                                        }}
                                        className={`p-3 hover:bg-gray-700/30 cursor-pointer ${
                                            index < 3 ? 'bg-gray-800/30' : ''
                                        }`}
                                        onClick={() =>
                                            toggleUserDetails(user.id)
                                        }
                                    >
                                        <div className="flex items-center justify-between">
                                            {/* Left side: Rank + User */}
                                            <div className="flex items-center space-x-3 min-w-0 flex-1">
                                                {/* Rank */}
                                                <div className="flex-shrink-0 w-8 flex justify-center">
                                                    {renderMedal(index + 1)}
                                                </div>

                                                {/* User Info */}
                                                <div className="flex items-center min-w-0 flex-1">
                                                    <ProfilePicture
                                                        user={user}
                                                        size="sm"
                                                        className="mr-2 flex-shrink-0"
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center">
                                                            <span
                                                                className={`text-white text-sm truncate ${
                                                                    index < 3
                                                                        ? 'font-bold'
                                                                        : ''
                                                                }`}
                                                                title={
                                                                    user.username
                                                                }
                                                            >
                                                                {user.username}
                                                            </span>
                                                            {index < 3 && (
                                                                <Star
                                                                    size={12}
                                                                    className={`ml-1 flex-shrink-0 ${
                                                                        index ===
                                                                        0
                                                                            ? 'text-yellow-400'
                                                                            : index ===
                                                                              1
                                                                            ? 'text-gray-300'
                                                                            : 'text-amber-600'
                                                                    }`}
                                                                    fill="currentColor"
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right side: Selected column data */}
                                            <div className="flex-shrink-0 text-right">
                                                {mobileColumn === 'score' && (
                                                    <div className="text-white font-medium text-sm">
                                                        {user.score}
                                                    </div>
                                                )}
                                                {mobileColumn ===
                                                    'accuracy' && (
                                                    <div className="flex flex-col items-end">
                                                        <div className="w-16 bg-gray-700 rounded-full h-1.5 mb-1">
                                                            <div
                                                                className="bg-green-500 h-1.5 rounded-full"
                                                                style={{
                                                                    width: `${user.accuracy}%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-white text-xs">
                                                            {user.accuracy}%
                                                        </span>
                                                    </div>
                                                )}
                                                {mobileColumn ===
                                                    'quiz/category' && (
                                                    <div className="text-white text-sm">
                                                        {user.quizzesTaken}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Expanded Details for Mobile */}
                                        <AnimatePresence>
                                            {expandedUser === user.id && (
                                                <motion.div
                                                    initial={{
                                                        opacity: 0,
                                                        height: 0,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        height: 'auto',
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        height: 0,
                                                    }}
                                                    className="mt-3 pt-3 border-t border-gray-700/50"
                                                >
                                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                                        <div className="bg-gray-900/50 p-2 rounded">
                                                            <div className="text-gray-400 mb-1">
                                                                Score
                                                            </div>
                                                            <div className="text-white font-medium">
                                                                {user.score}
                                                            </div>
                                                        </div>
                                                        <div className="bg-gray-900/50 p-2 rounded">
                                                            <div className="text-gray-400 mb-1">
                                                                Accuracy
                                                            </div>
                                                            <div className="text-white">
                                                                {user.accuracy}%
                                                            </div>
                                                        </div>
                                                        <div className="bg-gray-900/50 p-2 rounded">
                                                            <div className="text-gray-400 mb-1">
                                                                Quizzes
                                                            </div>
                                                            <div className="text-white">
                                                                {
                                                                    user.quizzesTaken
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="bg-gray-900/50 p-2 rounded">
                                                            <div className="text-gray-400 mb-1">
                                                                Streak
                                                            </div>
                                                            <div className="text-yellow-400 font-medium">
                                                                8 days
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 text-gray-500">
                                <div className="flex flex-col items-center">
                                    <Trophy
                                        size={48}
                                        className="text-gray-600 mb-4"
                                    />
                                    <h3 className="text-xl font-medium mb-2">
                                        Leaderboard is empty
                                    </h3>
                                    <p className="max-w-md">
                                        Be the first to take a quiz and claim
                                        your spot at the top!
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Stats Section */}
                {leaderboard.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
                            <div className="text-3xl font-bold text-yellow-400 mb-2">
                                {leaderboard[0].score}
                            </div>
                            <div className="text-gray-400">
                                Top Score by {leaderboard[0].username}
                            </div>
                        </div>
                        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
                            <div className="text-3xl font-bold text-blue-400 mb-2">
                                {Math.round(
                                    leaderboard.reduce(
                                        (acc, user) => acc + user.accuracy,
                                        0
                                    ) / leaderboard.length
                                )}
                                %
                            </div>
                            <div className="text-gray-400">
                                Average Accuracy
                            </div>
                        </div>
                        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
                            <div className="text-3xl font-bold text-green-400 mb-2">
                                {leaderboard.reduce(
                                    (acc, user) => acc + user.quizzesTaken,
                                    0
                                )}
                            </div>
                            <div className="text-gray-400">
                                Quizzes Completed
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

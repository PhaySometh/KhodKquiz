import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar/NavBar';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Crown, Star, Award, RotateCw, ChevronDown, ChevronUp } from 'lucide-react';

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: 'score', direction: 'desc' });
    const [expandedUser, setExpandedUser] = useState(null);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const response = await axios.get('https://localhost:5000/leaderboard');
            setLeaderboard(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error Fetching leaderboard: ', error);
            // Enhanced mock data
            const mockData = [
                { id: 1, username: 'CodingWizard', score: 2850, quizzesTaken: 12, accuracy: 92 },
                { id: 2, username: 'DevNinja', score: 2450, quizzesTaken: 10, accuracy: 88 },
                { id: 3, username: 'ByteMaster', score: 2200, quizzesTaken: 9, accuracy: 85 },
                { id: 4, username: 'SyntaxSamurai', score: 1950, quizzesTaken: 8, accuracy: 82 },
                { id: 5, username: 'PixelPusher', score: 1750, quizzesTaken: 7, accuracy: 79 },
                { id: 6, username: 'CodeJedi', score: 1550, quizzesTaken: 6, accuracy: 76 },
                { id: 7, username: 'BinaryBard', score: 1350, quizzesTaken: 5, accuracy: 74 },
                { id: 8, username: 'AlgorithmAce', score: 1150, quizzesTaken: 5, accuracy: 72 },
                { id: 9, username: 'CSSChampion', score: 950, quizzesTaken: 4, accuracy: 68 },
                { id: 10, username: 'ReactRanger', score: 750, quizzesTaken: 3, accuracy: 65 },
            ];
            setLeaderboard(mockData);
            setLoading(false);
        }
    };

    const sortLeaderboard = (key) => {
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
        return <span className="font-medium">{rank}</span>;
    };

    const getRankColor = (rank) => {
        if (rank === 1) return 'bg-gradient-to-r from-yellow-500 to-yellow-600 border-yellow-300';
        if (rank === 2) return 'bg-gradient-to-r from-gray-500 to-gray-600 border-gray-300';
        if (rank === 3) return 'bg-gradient-to-r from-amber-700 to-amber-800 border-amber-500';
        if (rank <= 5) return 'bg-gradient-to-r from-purple-600 to-purple-700 border-purple-400';
        if (rank <= 10) return 'bg-gradient-to-r from-blue-600 to-blue-700 border-blue-400';
        return 'bg-gradient-to-r from-gray-700 to-gray-800 border-gray-600';
    };

    const refreshLeaderboard = async () => {
        setLoading(true);
        await fetchLeaderboard();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
                <Navbar />
                <div className="flex justify-center items-center pt-32">
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="w-16 h-16 bg-yellow-500 rounded-full mb-4"></div>
                        <div className="h-6 bg-gray-700 rounded w-48 mb-2"></div>
                        <div className="h-4 bg-gray-700 rounded w-64"></div>
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
                        See where you stand among the best quiz takers. The fastest and most accurate rise to the top!
                    </p>
                    
                    <motion.button
                        onClick={refreshLeaderboard}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-6 bg-gray-800 hover:bg-gray-700 text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 mx-auto"
                    >
                        <RotateCw size={18} />
                        Refresh Leaderboard
                    </motion.button>
                </motion.div>
                
                {/* Podium Section */}
                {leaderboard.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12"
                    >
                        {leaderboard.slice(0, 3).map((user, index) => (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                                className={`flex flex-col items-center p-6 rounded-2xl border-2 ${
                                    index === 0 ? 'order-2 md:order-1 h-64' : 
                                    index === 1 ? 'order-1 md:order-0 h-56' : 
                                    'order-3 md:order-2 h-52'
                                } ${getRankColor(index + 1)} shadow-xl`}
                            >
                                <div className="text-5xl font-bold text-white mb-4">
                                    {index + 1}
                                </div>
                                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-4" />
                                <h3 className="text-xl font-bold text-white mb-1">{user.username}</h3>
                                <div className="flex items-center gap-2 text-white">
                                    <Trophy size={16} />
                                    <span className="font-bold">{user.score} points</span>
                                </div>
                                <div className="mt-3 text-xs text-white/80">
                                    {user.quizzesTaken} quizzes • {user.accuracy}% accuracy
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
                
                {/* Leaderboard Table */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 shadow-xl overflow-hidden"
                >
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-900/80 text-gray-300">
                                <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">
                                    Rank
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">
                                    User
                                </th>
                                <th 
                                    className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider cursor-pointer"
                                    onClick={() => sortLeaderboard('score')}
                                >
                                    <div className="flex items-center gap-1">
                                        Score
                                        {sortConfig.key === 'score' && (
                                            sortConfig.direction === 'asc' ? 
                                            <ChevronUp size={16} /> : 
                                            <ChevronDown size={16} />
                                        )}
                                    </div>
                                </th>
                                <th 
                                    className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider cursor-pointer"
                                    onClick={() => sortLeaderboard('accuracy')}
                                >
                                    <div className="flex items-center gap-1">
                                        Accuracy
                                        {sortConfig.key === 'accuracy' && (
                                            sortConfig.direction === 'asc' ? 
                                            <ChevronUp size={16} /> : 
                                            <ChevronDown size={16} />
                                        )}
                                    </div>
                                </th>
                                <th 
                                    className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider cursor-pointer"
                                    onClick={() => sortLeaderboard('quizzesTaken')}
                                >
                                    <div className="flex items-center gap-1">
                                        Quizzes
                                        {sortConfig.key === 'quizzesTaken' && (
                                            sortConfig.direction === 'asc' ? 
                                            <ChevronUp size={16} /> : 
                                            <ChevronDown size={16} />
                                        )}
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
                                            transition={{ duration: 0.3, delay: 0.1 * index }}
                                            className={`hover:bg-gray-700/30 cursor-pointer ${index < 3 ? 'bg-gray-800/30' : ''}`}
                                            onClick={() => toggleUserDetails(user.id)}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {renderMedal(index + 1)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 mr-3" />
                                                    <span className={`${index < 3 ? 'font-bold' : ''}`}>
                                                        {user.username}
                                                    </span>
                                                    {index < 3 && (
                                                        <Star 
                                                            size={16} 
                                                            className={`ml-2 ${
                                                                index === 0 ? 'text-yellow-400' : 
                                                                index === 1 ? 'text-gray-300' : 
                                                                'text-amber-600'
                                                            }`} 
                                                            fill="currentColor"
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium">
                                                {user.score}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 bg-gray-700 rounded-full h-2">
                                                        <div 
                                                            className="bg-green-500 h-2 rounded-full" 
                                                            style={{ width: `${user.accuracy}%` }}
                                                        ></div>
                                                    </div>
                                                    {user.accuracy}%
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {user.quizzesTaken}
                                            </td>
                                        </motion.tr>
                                        
                                        <AnimatePresence>
                                            {expandedUser === user.id && (
                                                <motion.tr
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="bg-gray-800/50"
                                                >
                                                    <td colSpan="5" className="px-6 py-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                                                            <div className="bg-gray-900/50 p-4 rounded-lg">
                                                                <h4 className="text-gray-400 text-sm mb-2">Recent Activity</h4>
                                                                <p className="text-sm">
                                                                    5 quizzes in the last week
                                                                </p>
                                                            </div>
                                                            <div className="bg-gray-900/50 p-4 rounded-lg">
                                                                <h4 className="text-gray-400 text-sm mb-2">Streak</h4>
                                                                <p className="text-sm">
                                                                    <span className="font-bold text-yellow-400">8 days</span> active streak
                                                                </p>
                                                            </div>
                                                            <div className="bg-gray-900/50 p-4 rounded-lg">
                                                                <h4 className="text-gray-400 text-sm mb-2">Achievements</h4>
                                                                <div className="flex gap-2">
                                                                    <div className="bg-yellow-500/20 p-2 rounded">
                                                                        <Trophy size={16} className="text-yellow-400" />
                                                                    </div>
                                                                    <div className="bg-blue-500/20 p-2 rounded">
                                                                        <Star size={16} className="text-blue-400" />
                                                                    </div>
                                                                    <div className="bg-green-500/20 p-2 rounded">
                                                                        <Award size={16} className="text-green-400" />
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
                                    <td colSpan="5" className="text-center py-16 text-gray-500">
                                        <div className="flex flex-col items-center">
                                            <Trophy size={48} className="text-gray-600 mb-4" />
                                            <h3 className="text-xl font-medium mb-2">Leaderboard is empty</h3>
                                            <p className="max-w-md">
                                                Be the first to take a quiz and claim your spot at the top!
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
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
                                {Math.round(leaderboard.reduce((acc, user) => acc + user.accuracy, 0) / leaderboard.length)}%
                            </div>
                            <div className="text-gray-400">
                                Average Accuracy
                            </div>
                        </div>
                        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
                            <div className="text-3xl font-bold text-green-400 mb-2">
                                {leaderboard.reduce((acc, user) => acc + user.quizzesTaken, 0)}
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
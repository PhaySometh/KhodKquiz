import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Trophy, Target, Clock, Eye } from 'lucide-react';
import apiClient from '../utils/axiosConfig';
import LoadingSpinner from './LoadingSpinner';

const AttemptSelectionModal = ({ isOpen, onClose, quizId, onSelectAttempt }) => {
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [quizInfo, setQuizInfo] = useState(null);

    useEffect(() => {
        if (isOpen && quizId) {
            fetchAttempts();
        }
    }, [isOpen, quizId]);

    const fetchAttempts = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(`/api/student/quiz/${quizId}/attempt-selection`);
            if (response.data.success) {
                setAttempts(response.data.data.attempts);
                setQuizInfo(response.data.data.quiz);
            }
        } catch (error) {
            console.error('Error fetching attempts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAttempt = (attemptId) => {
        onSelectAttempt(attemptId);
        onClose();
    };

    const getScoreColor = (accuracy) => {
        if (accuracy >= 80) return 'text-green-500';
        if (accuracy >= 60) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getScoreBgColor = (accuracy) => {
        if (accuracy >= 80) return 'bg-green-100 border-green-200';
        if (accuracy >= 60) return 'bg-yellow-100 border-yellow-200';
        return 'bg-red-100 border-red-200';
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold">Select Attempt to Review</h2>
                                {quizInfo && (
                                    <p className="text-blue-100 text-sm mt-1">
                                        {quizInfo.title} • {quizInfo.difficulty}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <LoadingSpinner size="large" />
                            </div>
                        ) : attempts.length > 0 ? (
                            <div className="space-y-4">
                                <p className="text-gray-600 text-sm mb-6">
                                    Choose which attempt you'd like to review in detail. You can see your answers, correct solutions, and performance breakdown.
                                </p>
                                
                                {attempts.map((attempt, index) => (
                                    <motion.div
                                        key={attempt.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${getScoreBgColor(attempt.accuracy)} hover:scale-[1.02]`}
                                        onClick={() => handleSelectAttempt(attempt.id)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                {/* Attempt Number */}
                                                <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg text-blue-600 shadow-sm">
                                                    #{attempt.attemptNumber}
                                                </div>
                                                
                                                {/* Attempt Details */}
                                                <div>
                                                    <div className="flex items-center space-x-4 mb-2">
                                                        <div className="flex items-center text-gray-700">
                                                            <Trophy size={16} className="mr-1" />
                                                            <span className="font-semibold">{attempt.score} points</span>
                                                        </div>
                                                        <div className={`flex items-center font-semibold ${getScoreColor(attempt.accuracy)}`}>
                                                            <Target size={16} className="mr-1" />
                                                            <span>{attempt.accuracy}% accuracy</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                        <div className="flex items-center">
                                                            <Calendar size={14} className="mr-1" />
                                                            <span>{attempt.formattedDate}</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Clock size={14} className="mr-1" />
                                                            <span>{Math.floor(attempt.timeTaken / 60)}m {attempt.timeTaken % 60}s</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="text-sm text-gray-600 mt-1">
                                                        {attempt.correctAnswers} of {attempt.totalQuestions} questions correct
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* View Button */}
                                            <div className="flex items-center">
                                                <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                                                    <Eye size={16} />
                                                    View Details
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Best Attempt Badge */}
                                        {index === 0 && (
                                            <div className="absolute top-2 right-2">
                                                <div className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                                    Latest
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Best Score Badge */}
                                        {attempt.score === Math.max(...attempts.map(a => a.score)) && attempts.length > 1 && (
                                            <div className="absolute top-2 left-2">
                                                <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                                    Best Score
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-500">
                                    <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg font-medium">No attempts found</p>
                                    <p className="text-sm">Complete this quiz to see your attempts here.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AttemptSelectionModal;

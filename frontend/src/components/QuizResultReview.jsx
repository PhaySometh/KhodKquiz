import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle,
    XCircle,
    Clock,
    Award,
    BarChart2,
    ChevronLeft,
    ChevronRight,
    Eye,
    Calendar,
    Target,
    Timer,
} from 'lucide-react';
import apiClient from '../utils/axiosConfig';
import LoadingSpinner from './LoadingSpinner';

const QuizResultReview = ({ resultId, onClose }) => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResultDetails = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get(
                    `/api/student/quiz/result/${resultId}`
                );

                setResult(response.data.data);
                // Reset question index when new data is loaded
                setCurrentQuestionIndex(0);
            } catch (error) {
                console.error('Error fetching result details:', error);
                setError('Failed to load quiz results');
            } finally {
                setLoading(false);
            }
        };

        if (resultId) {
            fetchResultDetails();
        }
    }, [resultId]);

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-white rounded-xl p-8 flex flex-col items-center">
                    <LoadingSpinner size="large" />
                    <p className="mt-4 text-gray-600">
                        Loading quiz results...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !result) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-white rounded-xl p-8 max-w-md mx-4">
                    <div className="text-center">
                        <XCircle
                            className="mx-auto text-red-500 mb-4"
                            size={48}
                        />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            Error Loading Results
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {error || 'Quiz results not found'}
                        </p>
                        <button
                            onClick={onClose}
                            className="bg-blue-950 text-white px-6 py-2 rounded-lg hover:bg-orange-400 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Check if answers array exists and has data
    if (!result.answers || result.answers.length === 0) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-white rounded-xl p-8 max-w-md mx-4">
                    <div className="text-center">
                        <XCircle
                            className="mx-auto text-yellow-500 mb-4"
                            size={48}
                        />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            No Results Found
                        </h3>
                        <p className="text-gray-600 mb-4">
                            No quiz results were found for this attempt.
                        </p>
                        <button
                            onClick={onClose}
                            className="bg-blue-950 text-white px-6 py-2 rounded-lg hover:bg-orange-400 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Ensure currentQuestionIndex is within bounds
    const safeCurrentQuestionIndex = Math.max(
        0,
        Math.min(currentQuestionIndex, result.answers.length - 1)
    );
    const currentQuestion = result.answers[safeCurrentQuestionIndex];

    // Additional safety check for currentQuestion
    if (!currentQuestion) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-white rounded-xl p-8 max-w-md mx-4">
                    <div className="text-center">
                        <XCircle
                            className="mx-auto text-red-500 mb-4"
                            size={48}
                        />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            Invalid Question Data
                        </h3>
                        <p className="text-gray-600 mb-4">
                            The question data for this result is corrupted or
                            missing.
                        </p>
                        <button
                            onClick={onClose}
                            className="bg-blue-950 text-white px-6 py-2 rounded-lg hover:bg-orange-400 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    const nextQuestion = () => {
        if (currentQuestionIndex < result.answers.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };
    const prevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const formatTime = (seconds) => {
        if (!seconds) return 'N/A';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
            <div className="min-h-screen py-8 px-4">
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-950 to-blue-800 text-white p-6 rounded-t-xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <Eye size={24} />
                                <h2 className="text-2xl font-bold">
                                    Quiz Results Review
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <XCircle size={24} />
                            </button>
                        </div>

                        {/* Quiz Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <h3 className="text-xl font-semibold">
                                    {result.quiz.title}
                                </h3>
                                <p className="text-blue-200">
                                    {result.quiz.category} •{' '}
                                    {result.quiz.difficulty}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-blue-200">
                                    Attempt #{result.attemptNumber}
                                </p>
                                <p className="text-sm text-blue-300">
                                    {formatDate(result.completedAt)}
                                </p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white/10 rounded-lg p-3 text-center">
                                <Award className="mx-auto mb-1" size={20} />
                                <div className="text-lg font-bold">
                                    {result.score}
                                </div>
                                <div className="text-xs text-blue-200">
                                    Score
                                </div>
                            </div>
                            <div className="bg-white/10 rounded-lg p-3 text-center">
                                <Target className="mx-auto mb-1" size={20} />
                                <div className="text-lg font-bold">
                                    {result.accuracy}%
                                </div>
                                <div className="text-xs text-blue-200">
                                    Accuracy
                                </div>
                            </div>
                            <div className="bg-white/10 rounded-lg p-3 text-center">
                                <CheckCircle
                                    className="mx-auto mb-1"
                                    size={20}
                                />
                                <div className="text-lg font-bold">
                                    {result.correctAnswers}/
                                    {result.totalQuestions}
                                </div>
                                <div className="text-xs text-blue-200">
                                    Correct
                                </div>
                            </div>
                            <div className="bg-white/10 rounded-lg p-3 text-center">
                                <Timer className="mx-auto mb-1" size={20} />
                                <div className="text-lg font-bold">
                                    {formatTime(result.timeTaken)}
                                </div>
                                <div className="text-xs text-blue-200">
                                    Time
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Question Navigation */}
                    <div className="bg-gray-50 p-4 border-b">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">
                                    Question
                                </span>
                                <span className="bg-blue-950 text-white px-3 py-1 rounded-full text-sm font-medium">
                                    {currentQuestionIndex + 1} of{' '}
                                    {result.answers.length}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={prevQuestion}
                                    disabled={currentQuestionIndex === 0}
                                    className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={nextQuestion}
                                    disabled={
                                        currentQuestionIndex ===
                                        result.answers.length - 1
                                    }
                                    className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-3 bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-950 h-2 rounded-full transition-all duration-300"
                                style={{
                                    width: `${
                                        ((currentQuestionIndex + 1) /
                                            result.answers.length) *
                                        100
                                    }%`,
                                }}
                            />
                        </div>
                    </div>

                    {/* Question Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestionIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="p-6"
                        >
                            {/* Question */}
                            <div className="mb-6">
                                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                                    {currentQuestion?.questionText ||
                                        'Question text not available'}
                                </h4>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Clock size={16} />
                                        Time:{' '}
                                        {formatTime(currentQuestion?.timeTaken)}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {currentQuestion?.isCorrect ? (
                                            <>
                                                <CheckCircle
                                                    size={16}
                                                    className="text-green-500"
                                                />
                                                <span className="text-green-600">
                                                    Correct
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <XCircle
                                                    size={16}
                                                    className="text-red-500"
                                                />
                                                <span className="text-red-600">
                                                    Incorrect
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Answer Options */}
                            <div className="space-y-3">
                                {(currentQuestion?.allOptions || []).map(
                                    (option, index) => {
                                        const isSelected =
                                            option?.id ===
                                            currentQuestion?.selectedAnswer?.id;
                                        const isCorrect = option?.isCorrect;

                                        let className =
                                            'p-4 rounded-lg border-2 transition-all ';
                                        if (isSelected && isCorrect) {
                                            className +=
                                                'border-green-500 bg-green-50 text-green-800';
                                        } else if (isSelected && !isCorrect) {
                                            className +=
                                                'border-red-500 bg-red-50 text-red-800';
                                        } else if (!isSelected && isCorrect) {
                                            className +=
                                                'border-green-300 bg-green-25 text-green-700';
                                        } else {
                                            className +=
                                                'border-gray-200 bg-gray-50 text-gray-700';
                                        }

                                        return (
                                            <div
                                                key={option.id}
                                                className={className}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium">
                                                        {option?.text ||
                                                            'Option text not available'}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        {isSelected && (
                                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                                Your Answer
                                                            </span>
                                                        )}
                                                        {isCorrect && (
                                                            <CheckCircle
                                                                size={20}
                                                                className="text-green-500"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>

                            {/* Explanation */}
                            {!currentQuestion?.isCorrect && (
                                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <h5 className="font-semibold text-blue-900 mb-2">
                                        Correct Answer:
                                    </h5>
                                    <p className="text-blue-800">
                                        {currentQuestion?.correctAnswer?.text ||
                                            'Correct answer not available'}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Footer */}
                    <div className="bg-gray-50 p-4 rounded-b-xl flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            Completed on {formatDate(result.completedAt)}
                        </div>
                        <button
                            onClick={onClose}
                            className="bg-blue-950 text-white px-6 py-2 rounded-lg hover:bg-orange-400 transition-colors"
                        >
                            Close Review
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizResultReview;

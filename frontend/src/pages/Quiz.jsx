import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Triangle,
    Gem,
    Square,
    Circle,
    Check,
    X,
    RotateCw,
    Award,
    Clock,
    BarChart2,
} from 'lucide-react';
import AuthPrompt from '../components/AuthPrompt';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

// Button Styles
const answerStyles = [
    {
        bg: 'bg-red-500',
        hoverBg: 'hover:bg-red-600',
        icon: <Triangle className="rotate-180" />,
    },
    { bg: 'bg-blue-500', hoverBg: 'hover:bg-blue-600', icon: <Gem /> },
    { bg: 'bg-yellow-500', hoverBg: 'hover:bg-yellow-600', icon: <Square /> },
    { bg: 'bg-green-500', hoverBg: 'hover:bg-green-600', icon: <Circle /> },
];

const QUESTION_TIME_LIMIT = 25.0;

export default function Quiz() {
    const { id } = useParams();
    const [gameState, setGameState] = useState('intro'); // intro, playing, feedback, finished
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isCorrect, setIsCorrect] = useState(null);
    const [timerKey, setTimerKey] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(QUESTION_TIME_LIMIT);
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
    const [countCorrectAnswer, setCountCorrectAnswer] = useState(0);
    const [showAuthPrompt, setShowAuthPrompt] = useState(false);
    const timerRef = useRef(null);

    const { isAuthenticated } = useAuth();

    const [quizQuestions, setQuizQuestions] = useState([]);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/student/quiz/1`);
                setQuizQuestions(response.data.data);
            } catch (error) {
                console.error('Error fetching quiz:', error);
            }
        };

        fetchQuiz();
    }, [id]);

    // Reset timer
    useEffect(() => {
        if (gameState === 'playing') {
            setTimeRemaining(QUESTION_TIME_LIMIT);
            clearInterval(timerRef.current);

            const TICK_RATE = 10; // ms (update every 10 milliseconds)

            timerRef.current = setInterval(() => {
                setTimeRemaining((prev) => {
                    const next = +(prev - TICK_RATE / 1000).toFixed(2); // 2 decimal precision
                    if (next <= 0) {
                        clearInterval(timerRef.current);
                        handleTimeout();
                        return 0;
                    }
                    return next;
                });
            }, TICK_RATE);
        }

        return () => clearInterval(timerRef.current);
    }, [gameState, currentQuestionIndex]);

    // Game logic
    useEffect(() => {
        if (gameState === 'feedback') {
            const timeout = setTimeout(() => {
                const nextQuestion = currentQuestionIndex + 1;
                if (nextQuestion < quizQuestions.length) {
                    setCurrentQuestionIndex(nextQuestion);
                    setGameState('playing');
                    setSelectedAnswerIndex(null);
                } else {
                    setGameState('finished');
                }
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [gameState]);

    // Event handlers
    const handleAnswerClick = (answer, index) => {
        if (gameState !== 'playing') return;

        setSelectedAnswerIndex(index);
        clearInterval(timerRef.current);

        if (answer.isCorrect) {
            setScore(
                (prev) =>
                    prev +
                    Math.max(
                        1,
                        Math.ceil(1000 * (timeRemaining / QUESTION_TIME_LIMIT))
                    )
            );
            setCountCorrectAnswer(countCorrectAnswer + 1);
            setIsCorrect(true);
        } else {
            setIsCorrect(false);
        }

        setGameState('feedback');
    };

    const handleTimeout = () => {
        if (gameState !== 'playing') return;
        setIsCorrect(false);
        setGameState('feedback');
    };

    const startQuiz = () => {
        if (!isAuthenticated) {
            setShowAuthPrompt(true);
            return;
        }

        setCurrentQuestionIndex(0);
        setScore(0);
        setIsCorrect(null);
        setGameState('playing');
        setTimerKey((prev) => prev + 1);
    };

    const restartQuiz = () => {
        startQuiz();
    };

    // Render functions
    const renderIntroScreen = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-indigo-900 to-purple-900 p-6"
        >
            <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center max-w-2xl"
            >
                <motion.h1
                    className="text-5xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Web Dev Quiz Challenge
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-black/30 backdrop-blur-sm rounded-xl p-8 border border-white/10 shadow-xl"
                >
                    <div className="flex flex-col md:flex-row gap-8 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-500 p-3 rounded-lg">
                                <Clock size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">
                                    Time Challenge
                                </h3>
                                <p className="text-gray-300">
                                    {QUESTION_TIME_LIMIT} seconds per question
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-green-500 p-3 rounded-lg">
                                <BarChart2 size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Score Big</h3>
                                <p className="text-gray-300">
                                    Faster answers = more points!
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-purple-500 p-3 rounded-lg">
                                <Award size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">
                                    {quizQuestions.length} Questions
                                </h3>
                                <p className="text-gray-300">
                                    Test your web development knowledge
                                </p>
                            </div>
                        </div>
                    </div>

                    <motion.button
                        onClick={startQuiz}
                        className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-bold text-xl shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Start Quiz
                    </motion.button>
                </motion.div>
            </motion.div>
        </motion.div>
    );

    const renderPlayingScreen = () => {
        const currentQuestion = quizQuestions[currentQuestionIndex];

        return (
            <motion.div
                key={currentQuestionIndex}
                className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-gray-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Top Bar */}
                <div className="flex justify-between items-center p-4">
                    <div className="flex items-center gap-2">
                        <div className="bg-gray-700 px-3 py-1 rounded-full font-medium">
                            <span className="text-yellow-400">
                                {currentQuestionIndex + 1}
                            </span>
                            <span className="text-gray-400">
                                /{quizQuestions.length}
                            </span>
                        </div>
                        <div className="bg-gray-700 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                            <Award className="text-yellow-400" size={18} />
                            <span className="text-white">{score} pts</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-full">
                        <Clock size={18} className="text-red-400" />
                        <span className="font-bold text-lg">
                            {Math.ceil(timeRemaining)}s
                        </span>
                    </div>
                </div>

                {/* Timer Bar */}
                <motion.div
                    key={timerKey}
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{
                        duration: QUESTION_TIME_LIMIT,
                        ease: 'linear',
                    }}
                    className="h-1.5 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                />

                {/* Question Area */}
                <div className="flex-grow flex items-center justify-center p-6">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-gray-800/70 backdrop-blur-sm border border-gray-700 rounded-xl p-6 w-full max-w-2xl shadow-xl"
                    >
                        <h2 className="text-2xl md:text-3xl font-bold text-center">
                            {currentQuestion.questionText}
                        </h2>
                    </motion.div>
                </div>

                {/* Answer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 max-w-4xl mx-auto w-full">
                    {currentQuestion.options.map((answer, index) => (
                        <motion.button
                            key={index}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                                delay: 0.2 + index * 0.1,
                                type: 'spring',
                            }}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleAnswerClick(answer, index)}
                            className={`flex items-center p-4 rounded-xl text-lg md:text-xl font-bold min-h-[100px] transition-all duration-300 shadow-lg ${answerStyles[index].bg} ${answerStyles[index].hoverBg}`}
                        >
                            <span className="mr-3 text-white/90">
                                {answerStyles[index].icon}
                            </span>
                            <span className="text-left">
                                {answer.answerText}
                            </span>
                        </motion.button>
                    ))}
                </div>
            </motion.div>
        );
    };

    const renderFeedbackScreen = () => {
        const currentQuestion = quizQuestions[currentQuestionIndex];
        const correctAnswerIndex = currentQuestion.answerOptions.findIndex(
            (opt) => opt.isCorrect
        );

        return (
            <motion.div
                key="feedback"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className={`flex flex-col items-center justify-center h-full ${
                    isCorrect
                        ? 'bg-gradient-to-br from-green-700 to-emerald-800'
                        : 'bg-gradient-to-br from-red-700 to-rose-800'
                }`}
            >
                <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="mb-6"
                >
                    {isCorrect ? (
                        <Check size={100} className="text-white" />
                    ) : (
                        <X size={100} className="text-white" />
                    )}
                </motion.div>

                <motion.h2
                    className="text-5xl md:text-6xl font-bold mb-6"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {isCorrect ? 'Correct!' : 'Incorrect!'}
                </motion.h2>

                {!isCorrect && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-black/20 backdrop-blur-sm p-4 rounded-xl mb-6"
                    >
                        <p className="text-xl text-center">
                            Correct answer:{' '}
                            <span className="font-bold">
                                {
                                    currentQuestion.answerOptions[
                                        correctAnswerIndex
                                    ].answerText
                                }
                            </span>
                        </p>
                    </motion.div>
                )}

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-2xl font-bold"
                >
                    +
                    {isCorrect
                        ? Math.max(
                              1,
                              Math.ceil(
                                  1000 * (timeRemaining / QUESTION_TIME_LIMIT)
                              )
                          )
                        : 0}{' '}
                    points
                </motion.div>
            </motion.div>
        );
    };

    const renderFinishedScreen = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-indigo-900 to-purple-900 p-6"
        >
            <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="text-center max-w-2xl bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 shadow-xl"
            >
                <motion.h2
                    className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Quiz Completed!
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="my-8"
                >
                    <div className="text-6xl font-bold mb-2">
                        {score}{' '}
                        <span className="text-2xl text-gray-300">points</span>
                    </div>
                    <div className="text-xl">
                        You got{' '}
                        <span className="font-bold text-green-400">
                            {countCorrectAnswer} correct
                            {countCorrectAnswer > 1 ? (
                                <span> answers</span>
                            ) : (
                                <span> answer</span>
                            )}
                        </span>{' '}
                        out of {quizQuestions.length} questions
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-800/50 p-4 rounded-xl">
                        <div className="text-3xl font-bold text-green-400">
                            {quizQuestions.length}
                        </div>
                        <div className="text-gray-400">Questions</div>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-xl">
                        <div className="text-3xl font-bold text-yellow-400">
                            {score}
                        </div>
                        <div className="text-gray-400">Points</div>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-xl">
                        <div className="text-3xl font-bold text-blue-400">
                            {Math.round(
                                (countCorrectAnswer / quizQuestions.length) *
                                    100
                            )}
                            %
                        </div>
                        <div className="text-gray-400">Accuracy</div>
                    </div>
                </div>

                <motion.button
                    onClick={restartQuiz}
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl font-bold text-xl flex items-center justify-center gap-2 shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <RotateCw size={20} />
                    Play Again
                </motion.button>
            </motion.div>
        </motion.div>
    );

    return (
        <main className="w-full h-screen text-white overflow-hidden">
            <AnimatePresence mode="wait">
                {gameState === 'intro' && renderIntroScreen()}
                {gameState === 'playing' && renderPlayingScreen()}
                {gameState === 'feedback' && renderFeedbackScreen()}
                {gameState === 'finished' && renderFinishedScreen()}
            </AnimatePresence>

            {/* Authentication Prompt */}
            <AuthPrompt
                isOpen={showAuthPrompt}
                onClose={() => setShowAuthPrompt(false)}
                title="Start Your Quiz Journey"
                message="Sign in to track your progress, compete on leaderboards, and earn badges!"
            />
        </main>
    );
}
import { useState, useEffect } from 'react';
import apiClient from '../utils/axiosConfig';
import toast from 'react-hot-toast';

/**
 * Custom hook for managing quiz game logic and state
 * Handles game progression, scoring, answer tracking, and result submission
 * 
 * @param {Array} quizQuestions - Array of quiz questions
 * @param {string} quizId - ID of the current quiz
 * @param {boolean} isAuthenticated - Whether user is authenticated
 * @returns {object} Game state, handlers, and submission logic
 */
export const useQuizGameLogic = (quizQuestions, quizId, isAuthenticated) => {
    // Game state management
    const [gameState, setGameState] = useState('intro'); // intro, playing, feedback, finished
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    
    // Scoring and tracking
    const [score, setScore] = useState(0);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
    const [detailedAnswers, setDetailedAnswers] = useState([]);
    
    // Timing
    const [quizStartTime, setQuizStartTime] = useState(null);
    const [questionStartTime, setQuestionStartTime] = useState(null);
    
    // Results
    const [currentAttemptResult, setCurrentAttemptResult] = useState(null);

    /**
     * Calculates score based on correct answer and time remaining
     * @param {number} timeRemaining - Time remaining when answer was selected
     * @param {number} timeLimit - Total time limit for the question
     * @returns {number} Calculated score for the question
     */
    const calculateQuestionScore = (timeRemaining, timeLimit) => {
        const timeBonus = timeRemaining / timeLimit;
        return Math.max(1, Math.ceil(1000 * timeBonus));
    };

    /**
     * Records a detailed answer for the current question
     * @param {Object} answerData - Answer data including question ID, selected option, etc.
     */
    const recordDetailedAnswer = (answerData) => {
        setDetailedAnswers(previousAnswers => [...previousAnswers, answerData]);
    };

    /**
     * Handles answer selection and scoring
     * @param {Object} selectedAnswer - The selected answer option
     * @param {number} answerIndex - Index of the selected answer
     * @param {number} timeRemaining - Time remaining when answer was selected
     * @param {number} timeLimit - Total time limit for the question
     */
    const handleAnswerSelection = (selectedAnswer, answerIndex, timeRemaining, timeLimit) => {
        if (gameState !== 'playing') return;

        setSelectedAnswerIndex(answerIndex);
        
        // Calculate time taken for this question
        const questionTimeTaken = Math.ceil((Date.now() - questionStartTime) / 1000);
        
        // Record detailed answer
        const currentQuestion = quizQuestions[currentQuestionIndex];
        const answerRecord = {
            questionId: currentQuestion.id,
            selectedOptionId: selectedAnswer.id,
            isCorrect: selectedAnswer.isCorrect,
            timeTaken: questionTimeTaken,
        };
        
        recordDetailedAnswer(answerRecord);

        // Update score and correct answers count
        if (selectedAnswer.isCorrect) {
            const questionScore = calculateQuestionScore(timeRemaining, timeLimit);
            setScore(previousScore => previousScore + questionScore);
            setCorrectAnswersCount(previousCount => previousCount + 1);
            setIsCorrect(true);
        } else {
            setIsCorrect(false);
        }

        setGameState('feedback');
    };

    /**
     * Handles timeout when no answer is selected
     * @param {number} timeLimit - Total time limit for the question
     */
    const handleQuestionTimeout = (timeLimit) => {
        if (gameState !== 'playing') return;

        // Record timeout as incorrect answer
        const currentQuestion = quizQuestions[currentQuestionIndex];
        const timeoutRecord = {
            questionId: currentQuestion.id,
            selectedOptionId: null,
            isCorrect: false,
            timeTaken: timeLimit,
        };

        recordDetailedAnswer(timeoutRecord);
        setIsCorrect(false);
        setGameState('feedback');
    };

    /**
     * Starts a new quiz attempt
     */
    const startQuiz = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setCorrectAnswersCount(0);
        setIsCorrect(null);
        setGameState('playing');
        setQuizStartTime(Date.now());
        setQuestionStartTime(Date.now());
        setDetailedAnswers([]);
        setCurrentAttemptResult(null);
    };

    /**
     * Resets quiz to initial state
     */
    const resetQuiz = () => {
        setGameState('intro');
        setCurrentQuestionIndex(0);
        setSelectedAnswerIndex(null);
        setIsCorrect(null);
        setScore(0);
        setCorrectAnswersCount(0);
        setDetailedAnswers([]);
        setQuizStartTime(null);
        setQuestionStartTime(null);
        setCurrentAttemptResult(null);
    };

    // Handle game progression after feedback
    useEffect(() => {
        if (gameState === 'feedback') {
            const feedbackTimeout = setTimeout(() => {
                const nextQuestionIndex = currentQuestionIndex + 1;
                
                if (nextQuestionIndex < quizQuestions.length) {
                    setCurrentQuestionIndex(nextQuestionIndex);
                    setGameState('playing');
                    setSelectedAnswerIndex(null);
                    setQuestionStartTime(Date.now());
                } else {
                    setGameState('finished');
                }
            }, 2000);

            return () => clearTimeout(feedbackTimeout);
        }
    }, [gameState, currentQuestionIndex, quizQuestions.length]);

    // Submit quiz results when finished
    useEffect(() => {
        const submitQuizResults = async () => {
            if (
                gameState === 'finished' &&
                isAuthenticated &&
                quizStartTime &&
                !currentAttemptResult
            ) {
                try {
                    const totalTimeSpent = Math.round((Date.now() - quizStartTime) / 1000);

                    const submissionData = {
                        quizId: parseInt(quizId),
                        score: score,
                        correctAnswers: correctAnswersCount,
                        totalQuestions: quizQuestions.length,
                        timeTaken: totalTimeSpent,
                        answers: detailedAnswers,
                        startedAt: quizStartTime,
                    };

                    const response = await apiClient.post('/api/student/quiz/submit', submissionData);

                    if (response.data.success) {
                        setCurrentAttemptResult(response.data.data);
                        toast.success('Quiz results saved successfully!');
                    }
                } catch (error) {
                    console.error('Error submitting quiz results:', error);
                    toast.error('Failed to save quiz results');
                }
            }
        };

        submitQuizResults();
    }, [
        gameState,
        isAuthenticated,
        quizId,
        score,
        correctAnswersCount,
        quizQuestions.length,
        quizStartTime,
        detailedAnswers,
        currentAttemptResult,
    ]);

    return {
        // Game state
        gameState,
        currentQuestionIndex,
        selectedAnswerIndex,
        isCorrect,
        
        // Scoring
        score,
        correctAnswersCount,
        
        // Results
        currentAttemptResult,
        
        // Handlers
        handleAnswerSelection,
        handleQuestionTimeout,
        startQuiz,
        resetQuiz,
        
        // Utilities
        setQuestionStartTime
    };
};

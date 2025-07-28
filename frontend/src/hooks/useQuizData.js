import { useState, useEffect } from 'react';
import apiClient from '../utils/axiosConfig';
import toast from 'react-hot-toast';

/**
 * Custom hook for managing quiz data fetching and eligibility checking
 * Handles API calls for quiz questions and attempt validation
 * 
 * @param {string} quizId - ID of the quiz to fetch
 * @param {boolean} isAuthenticated - Whether user is authenticated
 * @returns {object} Quiz data, loading state, and eligibility information
 */
export const useQuizData = (quizId, isAuthenticated) => {
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [attemptInfo, setAttemptInfo] = useState(null);
    const [eligibilityChecked, setEligibilityChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuizData = async () => {
            if (!quizId) return;

            try {
                setIsLoading(true);
                setError(null);

                // Check eligibility first if user is authenticated
                if (isAuthenticated) {
                    const eligibilityResponse = await apiClient.get(
                        `/api/student/quiz/${quizId}/eligibility`
                    );
                    setAttemptInfo(eligibilityResponse.data.data);
                }

                // Fetch quiz questions
                const questionsResponse = await apiClient.get(`/api/student/quiz/${quizId}`);
                setQuizQuestions(questionsResponse.data.data || []);
                
            } catch (fetchError) {
                console.error('Error fetching quiz data:', fetchError);
                setError('Failed to load quiz. Please try again.');
                toast.error('Failed to load quiz. Please try again.');
            } finally {
                setIsLoading(false);
                setEligibilityChecked(true);
            }
        };

        fetchQuizData();
    }, [quizId, isAuthenticated]);

    /**
     * Checks if user can attempt the quiz based on attempt limits
     * @returns {boolean} Whether user can attempt the quiz
     */
    const canAttemptQuiz = () => {
        if (!isAuthenticated) return false;
        if (!attemptInfo) return true;
        return attemptInfo.canAttempt;
    };

    /**
     * Gets remaining attempts for the quiz
     * @returns {number} Number of remaining attempts
     */
    const getRemainingAttempts = () => {
        if (!attemptInfo) return 3;
        return attemptInfo.remainingAttempts || 0;
    };

    /**
     * Gets maximum allowed attempts
     * @returns {number} Maximum attempts allowed
     */
    const getMaxAttempts = () => {
        if (!attemptInfo) return 3;
        return attemptInfo.maxAttempts || 3;
    };

    return {
        quizQuestions,
        attemptInfo,
        eligibilityChecked,
        isLoading,
        error,
        canAttemptQuiz,
        getRemainingAttempts,
        getMaxAttempts
    };
};

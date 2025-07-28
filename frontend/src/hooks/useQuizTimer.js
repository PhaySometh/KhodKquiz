import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for managing quiz timer functionality
 * Handles countdown timer, timeout events, and timer cleanup
 * 
 * @param {number} timeLimit - Time limit for each question in seconds
 * @param {string} gameState - Current game state ('playing', 'feedback', etc.)
 * @param {number} currentQuestionIndex - Index of current question
 * @param {function} onTimeout - Callback function when timer reaches zero
 * @returns {object} Timer state and controls
 */
export const useQuizTimer = (timeLimit, gameState, currentQuestionIndex, onTimeout) => {
    const [timeRemaining, setTimeRemaining] = useState(timeLimit);
    const [timerKey, setTimerKey] = useState(0);
    const timerRef = useRef(null);

    // Reset and start timer when game state changes to playing
    useEffect(() => {
        if (gameState === 'playing') {
            setTimeRemaining(timeLimit);
            clearInterval(timerRef.current);

            const TICK_RATE = 10; // Update every 10 milliseconds for smooth animation

            timerRef.current = setInterval(() => {
                setTimeRemaining((previousTime) => {
                    const nextTime = +(previousTime - TICK_RATE / 1000).toFixed(2);
                    
                    if (nextTime <= 0) {
                        clearInterval(timerRef.current);
                        onTimeout();
                        return 0;
                    }
                    
                    return nextTime;
                });
            }, TICK_RATE);
        }

        return () => clearInterval(timerRef.current);
    }, [gameState, currentQuestionIndex, timeLimit, onTimeout]);

    /**
     * Stops the current timer
     */
    const stopTimer = () => {
        clearInterval(timerRef.current);
    };

    /**
     * Resets the timer key to force re-render
     */
    const resetTimerKey = () => {
        setTimerKey(previousKey => previousKey + 1);
    };

    return {
        timeRemaining,
        timerKey,
        stopTimer,
        resetTimerKey
    };
};

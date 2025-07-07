/**
 * QuizResult Model - Student Quiz Scores
 * 
 * This model stores the final score of a student after completing a quiz.
 * 
 * Database Table: quizResults
 * 
 * Business Rules:
 * - Each record links a student to a specific quiz and stores their score.
 * - A student can only have one recorded result per quiz (enforced by a unique index).
 * - If a student or quiz is deleted, related quiz results are also deleted (CASCADE).
 * - Tracks quiz attempt number and the timestamp of when it was taken.
 * 
 * Use Cases:
 * - Recording and retrieving student performance data.
 * - Supporting score reporting and analytics features.
 * - Limiting duplicate results per student-quiz pair.
 * 
 * @version 1.0.0
 * @author KhodKquiz Team
 */

import { DataTypes } from 'sequelize';
import sequelize from '../config/db/sequelize.js';

/**
 * QuizResult Model Definition
 * 
 * Represents the final result (score and attempt) of a student for a given quiz.
 */
const QuizResult = sequelize.define('QuizResult', {
    /**
     * Student ID - Foreign key referencing the student who took the quiz.
     */
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
        onDelete: 'CASCADE',  // Clean up results if student is deleted
        comment: 'ID of the student who took the quiz'
    },

    /**
     * Quiz ID - Foreign key referencing the quiz that was taken.
     */
    quizId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'quizzes',
            key: 'id',
        },
        onDelete: 'CASCADE',  // Clean up results if quiz is deleted
        comment: 'ID of the quiz taken by the student'
    },

    /**
     * Score - The final score obtained by the student.
     */
    score: {
        type: DataTypes.DECIMAL(9, 2),
        allowNull: true,
        comment: 'Final score achieved by the student on the quiz'
    },

    /**
     * Attempt - Number of the attempt (e.g., first, second) for the quiz.
     */
    attempt: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        comment: 'Attempt number of the quiz by the student'
    },

    /**
     * Taken At - Timestamp of when the quiz was completed.
     */
    takenAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: 'Date/time when the quiz was taken'
    },
}, {
    tableName: 'quizResults',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['studentId', 'quizId'],
            name: 'unique_student_quiz_result'
        }
    ],
    comment: 'Records the final quiz results for each student, including score and attempt number'
});

export default QuizResult;
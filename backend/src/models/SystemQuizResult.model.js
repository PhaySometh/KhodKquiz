/**
 * SystemQuizResult Model - Records Quiz Results for Students
 * 
 * This model tracks the outcome of a student's attempt on a system-generated quiz.
 * 
 * Database Table: systemQuizResults
 * 
 * Business Rules:
 * - Each result links one student to one system quiz attempt.
 * - The score is stored as a decimal for accuracy.
 * - The timestamp when the quiz was taken is recorded.
 * - Each student may have multiple results for different system quizzes.
 * 
 * Use Cases:
 * - Storing results for performance tracking and reporting.
 * - Allowing analysis of student performance over time.
 * - Supporting dashboards and analytics for educators and admins.
 * 
 * @version 1.0.0
 * @author KhodKquiz Team
 */

import sequelize from "../config/db/sequelize.js";
import { DataTypes } from "sequelize";

/**
 * SystemQuizResult Model Definition
 * 
 * Represents the score and metadata for a student's attempt at a system quiz.
 */
const SystemQuizResult = sequelize.define('SystemQuizResult', {
    /**
     * Student ID - Foreign key referencing the student who took the quiz.
     */
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        comment: 'ID of the student who took the quiz'
    },

    /**
     * System Quiz ID - Foreign key referencing the quiz that was taken.
     */
    systemQuizId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'systemQuizzes',
            key: 'id'
        },
        comment: 'ID of the system quiz that was taken'
    },

    /**
     * Score - The student’s score on the quiz.
     */
    score: {
        type: DataTypes.DECIMAL(9, 2),
        allowNull: false,
        comment: 'Score received by the student for this quiz attempt'
    },

    /**
     * Taken At - Timestamp of when the quiz was taken.
     */
    takenAt: {
        type: DataTypes.DATE,
        comment: 'Date and time when the quiz was taken'
    }
}, {
    modelName: 'systemQuizResult',
    timestamps: false,
    comment: 'Stores results of system quizzes taken by students'
});

export default SystemQuizResult;
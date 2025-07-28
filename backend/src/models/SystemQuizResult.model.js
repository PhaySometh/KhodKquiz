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

import { DataTypes } from 'sequelize';

/**
 * SystemQuizResult Model Definition
 *
 * Represents the score and metadata for a student's attempt at a system quiz.
 */
export default (sequelize) => {
    return sequelize.define(
        'SystemQuizResult',
        {
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
                comment: 'ID of the student who took the quiz',
            },

            /**
             * System Quiz ID - Foreign key referencing the quiz that was taken.
             */
            systemQuizId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'systemQuizzes',
                    key: 'id',
                },
                comment: 'ID of the system quiz that was taken',
            },

            /**
             * Score - The student’s score on the quiz.
             */
            score: {
                type: DataTypes.DECIMAL(9, 2),
                allowNull: false,
                comment: 'Score received by the student for this quiz attempt',
            },

            /**
             * Attempt Number - Which attempt this is for the student (1, 2, 3).
             */
            attemptNumber: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
                comment: 'Attempt number for this student on this quiz (1-3)',
            },

            /**
             * Total Questions - Total number of questions in the quiz.
             */
            totalQuestions: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: 'Total number of questions in the quiz',
            },

            /**
             * Correct Answers - Number of questions answered correctly.
             */
            correctAnswers: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: 'Number of questions answered correctly',
            },

            /**
             * Time Taken - Total time taken to complete the quiz in seconds.
             */
            timeTaken: {
                type: DataTypes.INTEGER,
                allowNull: true,
                comment: 'Total time taken to complete the quiz in seconds',
            },

            /**
             * Started At - Timestamp of when the quiz was started.
             */
            startedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
                comment: 'Date and time when the quiz was started',
            },

            /**
             * Completed At - Timestamp of when the quiz was completed.
             */
            completedAt: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: 'Date and time when the quiz was completed',
            },

            /**
             * Taken At - Timestamp of when the quiz was taken (for backward compatibility).
             */
            takenAt: {
                type: DataTypes.DATE,
                comment: 'Date and time when the quiz was taken',
            },
        },
        {
            modelName: 'systemQuizResult',
            timestamps: false,
            comment: 'Stores results of system quizzes taken by students',
        }
    );

    // Define associations
    SystemQuizResult.associate = (models) => {
        // Belongs to SystemQuiz
        SystemQuizResult.belongsTo(models.SystemQuiz, {
            foreignKey: 'systemQuizId',
            as: 'SystemQuiz',
        });

        // Belongs to User (student)
        SystemQuizResult.belongsTo(models.User, {
            foreignKey: 'studentId',
            as: 'Student',
        });

        // Has many SystemStudentAnswers
        SystemQuizResult.hasMany(models.SystemStudentAnswer, {
            foreignKey: 'systemQuizResultId',
            as: 'SystemStudentAnswers',
        });
    };

    return SystemQuizResult;
};

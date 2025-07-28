/**
 * SystemStudentAnswer Model - Student Responses to System Quiz Questions
 *
 * This model records the answer option selected by a student for a particular system quiz question
 * within a specific quiz attempt.
 *
 * Database Table: systemStudentAnswers
 *
 * Business Rules:
 * - Each record links one student to one system question and the selected answer option.
 * - Multiple answers can exist for the same student/question combination (different attempts).
 * - Each answer is tied to a specific quiz result (attempt).
 * - Records the timestamp when the answer was submitted.
 *
 * Use Cases:
 * - Tracking student responses for system quiz questions across multiple attempts.
 * - Supporting detailed analysis of answer patterns and performance.
 * - Enabling quiz result review with individual question breakdown.
 *
 * @version 1.0.0
 * @author KhodKquiz Team
 */

import { DataTypes } from 'sequelize';

/**
 * SystemStudentAnswer Model Definition
 *
 * Represents a student's selected answer option for a specific system quiz question
 * within a particular quiz attempt.
 */
export default (sequelize) => {
    return sequelize.define(
        'SystemStudentAnswer',
        {
            /**
             * System Quiz Result ID - Foreign key referencing the quiz attempt.
             */
            systemQuizResultId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'systemQuizResults',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                comment: 'ID of the quiz attempt this answer belongs to',
            },

            /**
             * Student ID - Foreign key referencing the student who answered.
             */
            studentId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                comment: 'ID of the student who submitted the answer',
            },

            /**
             * System Question ID - Foreign key referencing the system question being answered.
             */
            systemQuestionId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'systemQuestions',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                comment: 'ID of the system question answered',
            },

            /**
             * Selected System Answer Option ID - Foreign key referencing the chosen answer option.
             */
            selectedSystemAnswerOptionId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'systemAnswerOptions',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                comment: 'ID of the selected system answer option',
            },

            /**
             * Is Correct - Boolean indicating if the selected answer was correct.
             */
            isCorrect: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                comment: 'Whether the selected answer was correct',
            },

            /**
             * Time Taken - Time in seconds taken to answer this question.
             */
            timeTaken: {
                type: DataTypes.INTEGER,
                allowNull: true,
                comment: 'Time in seconds taken to answer this question',
            },

            /**
             * Answered At - Timestamp of when the answer was submitted.
             */
            answeredAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                comment: 'Date/time when the student submitted this answer',
            },
        },
        {
            tableName: 'systemStudentAnswers',
            timestamps: false,
            indexes: [
                {
                    fields: ['systemQuizResultId', 'systemQuestionId'],
                    name: 'idx_system_result_question',
                },
                {
                    fields: ['studentId', 'systemQuestionId'],
                    name: 'idx_student_system_question',
                },
            ],
            comment:
                'Stores student selections for system quiz questions with attempt tracking',
        }
    );

    // Define associations
    SystemStudentAnswer.associate = (models) => {
        // Belongs to SystemQuizResult
        SystemStudentAnswer.belongsTo(models.SystemQuizResult, {
            foreignKey: 'systemQuizResultId',
            as: 'SystemQuizResult',
        });

        // Belongs to User (student)
        SystemStudentAnswer.belongsTo(models.User, {
            foreignKey: 'studentId',
            as: 'Student',
        });

        // Belongs to SystemQuestion
        SystemStudentAnswer.belongsTo(models.SystemQuestion, {
            foreignKey: 'systemQuestionId',
            as: 'SystemQuestion',
        });

        // Belongs to SystemAnswerOption (selected answer)
        SystemStudentAnswer.belongsTo(models.SystemAnswerOption, {
            foreignKey: 'selectedSystemAnswerOptionId',
            as: 'SystemAnswerOption',
        });
    };

    return SystemStudentAnswer;
};

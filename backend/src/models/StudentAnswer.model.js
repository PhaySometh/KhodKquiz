/**
 * StudentAnswer Model - Student Responses to Questions
 * 
 * This model records the answer option selected by a student for a particular question.
 * 
 * Database Table: studentAnswers
 * 
 * Business Rules:
 * - Each record links one student to one question and the selected answer option.
 * - A student can answer each question only once (enforced by a unique index).
 * - Deleting a student, question, or answer option will cascade and remove related answers.
 * - Records the timestamp when the answer was submitted.
 * 
 * Use Cases:
 * - Tracking student responses for quiz questions.
 * - Supporting analysis of answer patterns and correctness.
 * - Preventing multiple answers for the same question by the same student.
 * 
 * @version 1.0.0
 * @author KhodKquiz Team
 */

import { DataTypes } from 'sequelize';

/**
 * StudentAnswer Model Definition
 * 
 * Represents a student's selected answer option for a specific question.
 */
export default (sequelize) => {
    return sequelize.define('StudentAnswer', {
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
            onDelete: 'CASCADE',  // Remove answers if student is deleted
            comment: 'ID of the student who submitted the answer'
        },

        /**
         * Question ID - Foreign key referencing the question being answered.
         */
        questionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'questions',
                key: 'id',
            },
            onDelete: 'CASCADE',  // Remove answers if question is deleted
            comment: 'ID of the question answered'
        },

        /**
         * Selected Option ID - Foreign key referencing the chosen answer option.
         */
        selectedOptionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'answerOptions',
                key: 'id',
            },
            onDelete: 'CASCADE',  // Remove answers if answer option is deleted
            comment: 'ID of the selected answer option'
        },

        /**
         * Answered At - Timestamp of when the answer was submitted.
         */
        answeredAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            comment: 'Date/time when the student submitted this answer'
        },
    }, {
        tableName: 'studentAnswers',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['studentId', 'questionId'],
                name: 'unique_student_question_answer'
            }
        ],
        comment: 'Stores student selections for quiz questions, ensuring one answer per question per student'
    });
}
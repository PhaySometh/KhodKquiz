/**
 * AnswerOption Model - Multiple Choice Question Options
 * 
 * This model represents one of four possible answer options for a question.
 * Exactly one option per question should have `isCorrect` set to TRUE.
 * 
 * Database Table: answerOptions
 * 
 * Business Rules:
 * - Each answer option belongs to one question (via questionId).
 * - On question deletion, all related answer options are deleted (CASCADE).
 * - Only one answer option per question can be marked as correct.
 * 
 * Use Cases:
 * - Displaying multiple-choice answers to users.
 * - Validating user responses against the correct option.
 * 
 * @author KhodKquiz Team
 * @version 1.0.0
 */

import { DataTypes } from 'sequelize';
import sequelize from '../config/db/sequelize.js';

/**
 * AnswerOption Model Definition
 * 
 * Stores answer options for multiple-choice questions.
 */
const AnswerOption = sequelize.define('AnswerOption', {
    /**
     * Question ID - Foreign key linking to the question.
     */
    questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'questions',
            key: 'id',
            onDelete: 'CASCADE',   // Delete options if question deleted
        },
        comment: 'ID of the question this answer option belongs to'
    },

    /**
     * Text - The answer option text.
     */
    text: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Text content of the answer option'
    },

    /**
     * Is Correct - Marks if this option is the correct answer.
     */
    isCorrect: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Whether this option is the correct answer'
    },
}, {
    tableName: 'answerOptions',
    timestamps: false,
    comment: 'Multiple-choice answer options for questions',
});

export default AnswerOption;
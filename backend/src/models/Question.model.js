/**
 * Question Model - Quiz Questions
 * 
 * This model stores individual questions that belong to a specific quiz.
 * 
 * Database Table: questions
 * 
 * Business Rules:
 * - Each question is linked to a quiz via a foreign key.
 * - Deleting a quiz will also delete all associated questions (CASCADE).
 * - Each question contains the full text of the question itself.
 * 
 * Use Cases:
 * - Managing quiz content at the question level.
 * - Supporting dynamic quiz generation and editing.
 * 
 * @version 1.0.0
 * @author KhodKquiz Team
 */

import { DataTypes } from 'sequelize';

/**
 * Question Model Definition
 * 
 * Represents a question that is part of a quiz.
 */
export default (sequelize) => {
    return sequelize.define('Question', {
        /**
         * Quiz ID - Foreign key referencing the parent quiz.
         */
        quizId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'quizzes',
                key: 'id',
            },
            onDelete: 'CASCADE',  // Remove question if associated quiz is deleted
            comment: 'ID of the quiz this question belongs to'
        },

        /**
         * Question Text - The actual question content.
         */
        question: {
            type: DataTypes.TEXT,
            allowNull: false,
            comment: 'The text content of the question'
        },
    }, {
        tableName: 'questions',
        timestamps: false,
        comment: 'Stores individual questions associated with quizzes'
    });
}
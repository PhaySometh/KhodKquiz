/**
 * SystemAnswerOption Model - Predefined Answer Options for System Questions
 * 
 * This model defines the multiple-choice options available for system-generated questions.
 * 
 * Database Table: systemAnswerOptions
 * 
 * Business Rules:
 * - Each answer option belongs to a specific system question.
 * - An option can be marked as correct or incorrect.
 * - Text of the option can be plain or formatted (stored as TEXT).
 * - Each system question can have one or more associated answer options.
 * 
 * Use Cases:
 * - Presenting multiple-choice answers for system-based assessments.
 * - Identifying the correct option(s) for auto-grading purposes.
 * - Managing question banks with customizable options.
 * 
 * @version 1.0.0
 * @author KhodKquiz Team
 */

import { DataTypes } from "sequelize";

/**
 * SystemAnswerOption Model Definition
 * 
 * Represents an individual answer option linked to a system-defined question.
 */
export default (sequelize) => {
    return sequelize.define('SystemAnswerOption', {
        /**
         * System Question ID - Foreign key referencing the system question this option belongs to.
         */
        systemQuestionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'systemQuestions',
                key: 'id',
                onDelete: 'CASCADE'     // Delete options if question is deleted
            },
            comment: 'ID of the system question associated with this answer option'
        },

        /**
         * Text - The content of the answer option.
         */
        text: {
            type: DataTypes.TEXT,
            comment: 'Text content of the answer option'
        },

        /**
         * Is Correct - Indicates whether this option is the correct answer.
         */
        isCorrect: {
            type: DataTypes.BOOLEAN,
            comment: 'Flag to indicate if this answer option is correct'
        }
    }, {
        modelName: 'systemAnswerOptions',
        timestamps: false,
        comment: 'Stores possible answer options for system-generated questions'
    });
}
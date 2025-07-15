/**
 * SystemQuestion Model - Predefined Questions for System Quizzes
 * 
 * This model defines the questions that are part of system-generated quizzes.
 * 
 * Database Table: systemQuestions
 * 
 * Business Rules:
 * - Each system question belongs to one system quiz.
 * - Each question has associated text (e.g., the question prompt).
 * - A system question can have one or more answer options defined in `systemAnswerOptions`.
 * 
 * Use Cases:
 * - Building and managing automated quizzes for standardized testing.
 * - Associating multiple predefined questions with a specific quiz template.
 * - Supporting auto-grading by linking questions with correct answer options.
 * 
 * @version 1.0.0
 * @author KhodKquiz Team
 */

import { DataTypes } from "sequelize";
import sequelize from "../config/db/sequelize.js";

/**
 * SystemQuestion Model Definition
 * 
 * Represents a predefined question used in system-generated quizzes.
 */
export default (sequelize) => {
    return sequelize.define('SystemQuestion', {
        /**
         * System Quiz ID - Foreign key referencing the quiz this question belongs to.
         */
        systemQuizId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'systemQuizzes',
                key: 'id',
                onDelete: 'CASCADE'     // Delete questions if quiz is deleted
            },
            comment: 'ID of the system quiz that this question is part of'
        },

        /**
         * Text - The content of the quiz question.
         */
        text: {
            type: DataTypes.TEXT,
            comment: 'The actual text or prompt of the system question'
        }
    }, {
        tableName: 'systemQuestions',
        timestamps: false,
        comment: 'Stores predefined questions for system-generated quizzes',
        indexes: [
            {
                fields: ['systemQuizId']
            }
        ]
    });
}
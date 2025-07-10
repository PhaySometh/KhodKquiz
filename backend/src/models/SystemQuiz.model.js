/**
 * SystemQuiz Model - System-Generated Quiz Metadata
 * 
 * This model stores information about quizzes that are predefined and managed by the system.
 * 
 * Database Table: systemQuizzes
 * 
 * Business Rules:
 * - Each quiz has a title, description, and category.
 * - A quiz is associated with the admin who created it.
 * - The quiz creation timestamp is automatically recorded.
 * - System quizzes can be linked to multiple `systemQuestions`.
 * 
 * Use Cases:
 * - Structuring quiz templates for automatic assessments.
 * - Categorizing quizzes for filtering and organization.
 * - Associating quizzes with specific admin users for accountability and audit.
 * 
 * @version 1.0.0
 * @author KhodKquiz Team
 */

import sequelize from "../config/db/sequelize.js";
import { DataTypes } from "sequelize";

/**
 * SystemQuiz Model Definition
 * 
 * Represents the metadata and structure of a system-generated quiz.
 */
const SystemQuiz = sequelize.define('SystemQuiz', {
    /**
     * Title - The name or title of the quiz.
     */
    title: {
        type: DataTypes.STRING(150),
        allowNull: false,
        comment: 'Title of the system quiz'
    },

    /**
     * Description - Additional details about the quiz.
     */
    description: {
        type: DataTypes.TEXT,
        comment: 'Detailed description of what the quiz is about'
    },

    /**
     * Category - Classification or grouping of the quiz.
     */
    category: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Category to which this quiz belongs (e.g., Math, History)'
    },

    /**
     * Created By - ID of the admin who created the quiz.
     */
    createdBy: {
        type: DataTypes.INTEGER,
        references: {
            model: 'admins',
            key: 'id'
        },
        comment: 'ID of the admin who created this system quiz'
    },

    /**
     * Created At - Timestamp when the quiz was created.
     */
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: 'Date/time when the quiz was created'
    }
}, {
    tableName: 'systemQuizzes',
    timestamps: false,
    comment: 'Contains metadata for quizzes created and managed by the system'
});

export default SystemQuiz;
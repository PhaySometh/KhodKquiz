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
export default (sequelize) => {
    return sequelize.define('SystemQuiz', {
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
            type: DataTypes.INTEGER,
            references: {
                model: 'systemCategories',
                key: 'id',
                onDelete: 'NULL'
            },
            comment: 'Category to which this quiz belongs'
        },

        /**
         * Created By - ID of the admin who created the quiz.
         */
        createdBy: {
            type: DataTypes.INTEGER,
            references: {
                model: 'admins',
                key: 'id',
                onDelete: 'NULL'
            },
            comment: 'ID of the admin who created this system quiz'
        },

        /**
         * Status - Indicates whether the quiz is published, archived, or still in draft.
         */
        status: {
            type: DataTypes.ENUM('Published', 'Archived', 'Draft'),
            defaultValue: 'Published',
            comment: 'Current status of the quiz (e.g., Draft, Published, Archived)'
        },

        /**
         * Time - Duration in minutes allowed to complete the quiz.
         */
        time: {
            type: DataTypes.FLOAT,
            allowNull: false,
            comment: 'Time limit (in minutes) for completing the quiz'
        },

        /**
         * Attempts - Number of times the quiz has been attempted by students.
         */
        attempts: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: 'Number of times the quiz has been attempted by students'
        },

        /**
         * Average Score - Average score achieved by students on this quiz.
         */
        averageAccuracy: {
            type: DataTypes.DECIMAL(3, 2),
            defaultValue: 0,
            comment: 'Average score achieved by students on this quiz'
        },

        /**
         * Difficulty - Level of difficulty of the quiz.
         */
        difficulty: {
            type: DataTypes.ENUM('Easy', 'Medium', 'Hard'),
            allowNull: false,
            comment: 'Difficulty level of the quiz (Easy, Medium, Hard)'
        },

        /**
         * Questions Count - Number of questions in the quiz.
         */
        questionsCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: 'Number of questions in the quiz'
        },

        /**
         * Created At - Timestamp when the quiz was created.
         */
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
            comment: 'Date/time when the quiz was created'
        }
    }, {
        tableName: 'systemQuizzes',
        timestamps: false,
        comment: 'Contains metadata for quizzes created and managed by the system'
    });
}
/**
 * Quiz Model - Teacher-Created Quizzes
 * 
 * This model stores quizzes authored by teachers, including metadata such as category, status, and time limit.
 * 
 * Database Table: quizzes
 * 
 * Business Rules:
 * - Each quiz is created by a registered user (typically a teacher).
 * - Deleting a teacher will also delete their quizzes (CASCADE).
 * - A quiz includes a title, optional description/category, status, and duration.
 * 
 * Use Cases:
 * - Allowing teachers to create and manage quizzes.
 * - Supporting quiz publishing, drafting, and archiving workflows.
 * - Storing time-limited quiz metadata.
 * 
 * @version 1.0.0
 * @author KhodKquiz Team
 */

import sequelize from "../config/db/sequelize.js";
import { DataTypes } from "sequelize";

/**
 * Quiz Model Definition
 * 
 * Represents a quiz created by a teacher with metadata and configuration options.
 */
const Quiz = sequelize.define('Quiz', {
    /**
     * Quiz Title - Required short title of the quiz.
     */
    title: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Title of the quiz'
    },

    /**
     * Quiz Description - Optional detailed explanation of the quiz content.
     */
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Optional description providing more detail about the quiz'
    },

    /**
     * Quiz Category - Optional category or subject for organizing quizzes.
     */
    category: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Optional category or subject the quiz belongs to'
    },

    /**
     * Created By - Foreign key referencing the user who created the quiz.
     */
    createdBy: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE',  // Delete quizzes if teacher is deleted
        comment: 'ID of the teacher (user) who created the quiz'
    },

    /**
     * Status - Indicates whether the quiz is published, archived, or still in draft.
     */
    status: {
        type: DataTypes.ENUM('Published', 'Archived', 'Draft'),
        defaultValue: 'Draft',
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
     * Created At - Timestamp of when the quiz was created.
     */
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        comment: 'Date/time the quiz was created'
    }
}, {
    tableName: 'quizzes',
    timestamps: false,
    comment: 'Stores metadata and ownership of quizzes created by teachers'
});

export default Quiz;
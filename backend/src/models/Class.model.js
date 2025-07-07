/**
 * Class Model - Educational Classes
 * 
 * This model represents classes created and managed by teachers.
 * 
 * Database Table: classes
 * 
 * Business Rules:
 * - Each class must have a name and be linked to a teacher (teacherId).
 * - When a teacher is deleted, all their classes are deleted (CASCADE).
 * - Classes have an optional subject and a status (Active/Inactive).
 * - `createdAt` tracks when the class was created.
 * 
 * Use Cases:
 * - Organizing and managing classes in the educational platform.
 * - Assigning teachers and tracking class status.
 * 
 * @author
 * @version 1.0.0
 */

import sequelize from "../config/db/sequelize.js";
import { DataTypes } from "sequelize";

/**
 * Class Model Definition
 * 
 * Stores data for classes including name, teacher, subject, and status.
 */
const Class = sequelize.define('Class', {
    /**
     * Name - The class name/title.
     */
    name: {
        type: DataTypes.STRING(150),
        allowNull: false,
        comment: 'Name/title of the class'
    },

    /**
     * Description - Additional details about the class.
     */
    description: {
        type: DataTypes.TEXT,
        comment: 'Description or overview of the class'
    },

    /**
     * Teacher ID - Foreign key referencing the teacher who owns the class.
     */
    teacherId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE', // Delete classes if teacher is removed
        comment: 'ID of the teacher who created the class'
    },

    /**
     * Subject - Optional subject of the class.
     */
    subject: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Subject or topic of the class'
    },

    /**
     * Status - Indicates if the class is active or inactive.
     */
    status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        defaultValue: 'Active',
        comment: 'Current status of the class'
    },

    /**
     * Created At - Timestamp when the class was created.
     */
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Creation date/time of the class'
    },
}, {
    tableName: 'classes',
    timestamps: false,
    comment: 'Classes created and managed by teachers'
});

export default Class;
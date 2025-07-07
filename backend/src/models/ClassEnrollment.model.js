/**
 * ClassEnrollment Model - Student-Class Associations
 * 
 * This model links students to the classes they have joined.
 * 
 * Database Table: classEnrollments
 * 
 * Business Rules:
 * - Each enrollment record connects one student to one class.
 * - Duplicate enrollments for the same student and class are prevented by a unique index.
 * - When a class or student is deleted, their enrollments are also deleted (CASCADE).
 * - `enrolledAt` records when the student joined the class.
 * 
 * Use Cases:
 * - Tracking student memberships in classes.
 * - Managing class rosters and student participation.
 * 
 * @author KhodKquiz Team
 * @version 1.0.0
 */

import sequelize from "../config/db/sequelize.js";
import { DataTypes } from "sequelize";

/**
 * ClassEnrollment Model Definition
 * 
 * Stores records of student enrollments in classes.
 */
const ClassEnrollment = sequelize.define('ClassEnrollment', {
    /**
     * Class ID - Foreign key referencing the enrolled class.
     */
    classId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'classes',
            key: 'id'
        },
        onDelete: 'CASCADE',  // Clean up enrollments if class is deleted
        comment: 'ID of the class a student is enrolled in'
    },

    /**
     * Student ID - Foreign key referencing the enrolled student.
     */
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE',  // Clean up enrollments if student is deleted
        comment: 'ID of the enrolled student'
    },

    /**
     * Enrolled At - Timestamp when the enrollment occurred.
     */
    enrolledAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Date/time when the student enrolled in the class'
    }
}, {
    tableName: 'classEnrollments',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['classId', 'studentId'],
            name: 'unique_class_student_enrollment'
        }
    ],
    comment: 'Links students to classes they join, preventing duplicates'
});

export default ClassEnrollment;
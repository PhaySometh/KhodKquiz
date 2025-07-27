/**
 * Teacher Application Model - Teacher Role Promotion Requests
 * 
 * This model stores applications from students requesting promotion to teacher role.
 * 
 * Database Table: teacher_applications
 * 
 * Business Rules:
 * - Students can apply for teacher role promotion
 * - Each user can have only one pending application at a time
 * - Applications can be pending, approved, or rejected
 * - Approved applications result in user role change to 'teacher'
 * - Applications store detailed information for admin review
 * 
 * Use Cases:
 * - Managing teacher role promotion requests
 * - Admin review and approval workflow
 * - Tracking application history and status
 * 
 * @version 1.0.0
 * @author KhodKquiz Team
 */

import { DataTypes } from "sequelize";

/**
 * Teacher Application Model Definition
 * 
 * Represents a teacher role promotion application submitted by a student.
 */
export default (sequelize) => {
    return sequelize.define('TeacherApplication', {
        /**
         * User ID - Foreign key referencing the user applying for teacher role.
         */
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onDelete: 'CASCADE',
            comment: 'ID of the user applying for teacher role'
        },

        /**
         * Institution - Educational institution where the applicant teaches/works.
         */
        institution: {
            type: DataTypes.STRING(200),
            allowNull: false,
            comment: 'Name of the educational institution'
        },

        /**
         * Subject - Primary subject area the applicant wants to teach.
         */
        subject: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: 'Primary subject area for teaching'
        },

        /**
         * Experience - Teaching experience description.
         */
        experience: {
            type: DataTypes.TEXT,
            allowNull: false,
            comment: 'Description of teaching experience and qualifications'
        },

        /**
         * Motivation - Reason for applying for teacher role.
         */
        motivation: {
            type: DataTypes.TEXT,
            allowNull: false,
            comment: 'Motivation and reason for requesting teacher role'
        },

        /**
         * Status - Current status of the application.
         */
        status: {
            type: DataTypes.ENUM('pending', 'approved', 'rejected'),
            defaultValue: 'pending',
            comment: 'Current status of the teacher application'
        },

        /**
         * Admin Notes - Optional notes from admin during review.
         */
        adminNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Optional notes from admin during application review'
        },

        /**
         * Reviewed By - Admin who reviewed the application.
         */
        reviewedBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            },
            comment: 'ID of the admin who reviewed the application'
        },

        /**
         * Reviewed At - Timestamp when the application was reviewed.
         */
        reviewedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Date and time when application was reviewed'
        },

        /**
         * Created At - Timestamp when the application was submitted.
         */
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            comment: 'Application submission date/time'
        },

        /**
         * Updated At - Timestamp when the application was last updated.
         */
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            comment: 'Last update date/time'
        }
    }, {
        tableName: 'teacher_applications',
        timestamps: true,
        comment: 'Stores teacher role promotion applications and their review status',
        indexes: [
            {
                fields: ['userId']
            },
            {
                fields: ['status']
            },
            {
                fields: ['createdAt']
            },
            {
                unique: true,
                fields: ['userId'],
                where: {
                    status: 'pending'
                },
                name: 'unique_pending_application_per_user'
            }
        ]
    });
}

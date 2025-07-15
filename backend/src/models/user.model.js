/**
 * User Model - System Users
 * 
 * This model stores information about all users of the system, including both teachers and students.
 * 
 * Database Table: users
 * 
 * Business Rules:
 * - Each user has a unique email.
 * - Users can authenticate via local credentials or external providers (e.g., Google).
 * - Role defines whether the user is a student or teacher.
 * - Password may be nullable to accommodate external provider authentication.
 * - Stores optional profile picture and external provider ID.
 * 
 * Use Cases:
 * - Managing user accounts and authentication.
 * - Differentiating between user roles for access control.
 * - Supporting social login integration.
 * 
 * @version 1.0.0
 * @author KhodKquiz Team
 */

import { DataTypes } from "sequelize";

/**
 * User Model Definition
 * 
 * Represents a user within the system, either a student or teacher.
 */
export default (sequelize) => {
    return sequelize.define('User', {
        /**
         * Name - Full name of the user.
         */
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: 'Full name of the user'
        },

        /**
         * Email - Unique email address for login and contact.
         */
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
            comment: 'Unique email address of the user'
        },

        /**
         * Password - Hashed password for local authentication.
         * May be null if using external providers.
         */
        password: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Hashed password for local authentication'
        },

        /**
         * Provider - Authentication provider (e.g., local, google).
         */
        provider: {
            type: DataTypes.STRING,
            defaultValue: 'local',
            comment: 'Authentication provider (local or external)'
        },

        /**
         * Role - User role in the system (student or teacher).
         */
        role: {
            type: DataTypes.ENUM('student', 'teacher'),
            defaultValue: 'student',
            comment: 'Role assigned to the user'
        },

        /**
         * Picture - Optional profile picture URL or data.
         */
        picture: {
            type: DataTypes.TEXT,
            comment: 'Profile picture of the user'
        },

        /**
         * Google ID - External Google authentication ID.
         */
        googleId: {
            type: DataTypes.TEXT,
            comment: 'Google ID for users authenticated via Google'
        },

        /**
         * Created At - Timestamp when the user account was created.
         */
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            comment: 'Account creation date/time'
        },
    }, {
        tableName: 'users',
        timestamps: false,
        comment: 'Stores user accounts, roles, and authentication details'
    });
}
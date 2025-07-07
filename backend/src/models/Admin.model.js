/**
 * Admin Model - System Administrators
 * 
 * This model represents system administrators who have platform management privileges.
 * 
 * Database Table: admins
 * 
 * Business Rules:
 * - Each admin must have a unique username and a hashed password.
 * - `createdAt` stores the timestamp when the admin account was created.
 * 
 * Use Cases:
 * - Managing platform settings and user accounts.
 * - Performing administrative actions and oversight.
 * 
 * @author 
 * @version 1.0.0
 */

import { DataTypes } from "sequelize";
import sequelize from "../config/db/sequelize.js";

/**
 * Admin Model Definition
 * 
 * Stores administrator user credentials and metadata.
 */
const Admin = sequelize.define('Admin', {
    /**
     * Username - Unique identifier for the admin user.
     */
    username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Admin username (max 100 characters)'
    },

    /**
     * Hashed Password - Securely stored password hash.
     */
    hashedPassword: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Hashed password for admin authentication'
    },

    /**
     * Created At - Timestamp when the admin account was created.
     */
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Account creation date/time'
    }
}, {
    tableName: 'admins',
    timestamps: false,
    comment: 'System administrators with management privileges'
});

export default Admin;
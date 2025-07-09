/**
 * Badge Model - Achievement Badges
 * 
 * This model represents badges that users can earn or be awarded.
 * 
 * Database Table: badges
 * 
 * Business Rules:
 * - Each badge has a title and optional description.
 * - `picture` stores a URL or path to an image representing the badge.
 * - `createdAt` records when the badge was created, defaulting to the current timestamp.
 * 
 * Use Cases:
 * - Displaying earned badges on user profiles.
 * - Awarding badges based on user achievements.
 * 
 * @author KhodKquiz Team
 * @version 1.0.0
 */

import sequelize from "../config/db/sequelize.js";
import { DataTypes } from "sequelize";

/**
 * Badge Model Definition
 * 
 * Stores metadata and imagery for achievement badges.
 */
const Badge = sequelize.define('Badge', {
    /**
     * Title - Name of the badge.
     */
    title: {
        type: DataTypes.STRING(150),
        allowNull: false,
        comment: 'Name/title of the badge'
    },

    /**
     * Description - Details about the badge.
     */
    description: {
        type: DataTypes.TEXT,
        comment: 'Description of what the badge represents'
    },

    /**
     * Picture - URL or path to the badge image.
     */
    picture: {
        type: DataTypes.STRING(2048),
        comment: 'URL or file path for the badge image'
    },

    /**
     * Created At - Timestamp of badge creation.
     */
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: 'Date/time when the badge was created'
    }
}, {
    timestamps: false,
    tableName: 'badges',
    comment: 'Available achievement badges that can be awarded to users'
});

export default Badge;
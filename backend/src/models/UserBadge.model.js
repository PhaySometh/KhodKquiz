/**
 * UserBadge Model - User-Badge Associations
 * 
 * This model links users with the badges they have earned.
 * 
 * Database Table: userBadges
 * 
 * Business Rules:
 * - Each record connects one user to one badge.
 * - Duplicate badge assignments for the same user are prevented by a unique index.
 * - Deleting a user or badge cascades and removes related user-badge assignments.
 * - `createdAt` records when the badge was awarded to the user.
 * 
 * Use Cases:
 * - Tracking badge achievements for users.
 * - Managing gamification elements like rewards and recognitions.
 * 
 * @version 1.0.0
 * @author KhodKquiz Team
 */

import { DataTypes } from "sequelize";

/**
 * UserBadge Model Definition
 * 
 * Represents the association of badges earned by users.
 */
export default (sequelize) => {
    return sequelize.define('UserBadge', {
        /**
         * User ID - Foreign key referencing the user who earned the badge.
         */
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onDelete: 'CASCADE',  // Remove badge assignments if user is deleted
            comment: 'ID of the user who earned the badge'
        },

        /**
         * Badge ID - Foreign key referencing the badge earned.
         */
        badgeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'badges',
                key: 'id'
            },
            onDelete: 'CASCADE',  // Remove badge assignments if badge is deleted
            comment: 'ID of the badge earned by the user'
        },

        /**
         * Created At - Timestamp when the badge was awarded.
         */
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            comment: 'Date/time when the badge was awarded to the user'
        }
    }, {
        timestamps: false,
        tableName: 'userBadges',
        indexes: [
            {
                unique: true,
                fields: ['userId', 'badgeId'],
                name: 'unique_user_badge_assignment'
            }
        ],
        comment: 'Associates users with badges they have earned, preventing duplicates'
    });
}
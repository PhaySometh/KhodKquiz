import sequelize from "../config/db/sequelize.js";
import { DataTypes } from "sequelize";

// Connects users with earned badges
const UserBadge = sequelize.define('UserBadge', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'     // Ensure badge assignments are removed if user or badge is deleted.
    },
    badgeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'badges',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false,
    tableName: 'userBadges',
    indexes: [
        {
            unique: true,
            fields: ['userId', 'badgeId']
        }
    ]
});

export default UserBadge;
import sequelize from "../config/db/sequelize.js";
import { DataTypes } from "sequelize";

const UserBadge = sequelize.define('UserBadge', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    badgeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'badges',
            key: 'id'
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    underscored: true,
    timestamps: false,
    tableName: 'userBadges'
});

export default UserBadge;
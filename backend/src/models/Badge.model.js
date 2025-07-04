import sequelize from "../config/db/sequelize.js";
import { DataTypes } from "sequelize";

// Stores available badges
const Badge = sequelize.define('Badge', {
    title: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
    },
    picture: {
        type: DataTypes.STRING(2048)
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false,
    tableName: 'badges'
});

export default Badge;
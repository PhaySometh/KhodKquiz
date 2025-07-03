import sequelize from "../config/db/sequelize.js";
import { DataTypes } from "sequelize";

const Badge = sequelize.define('Badge', {
    title: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
    },
    picture: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: false,
    tableName: 'badges'
});

export default Badge;
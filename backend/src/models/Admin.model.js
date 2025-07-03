import sequelize from "../config/db/sequelize.js";
import { DataTypes } from "sequelize";

// Stores system admins (can manage the platform)
const Admin = sequelize.define('Admin', {
    username: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    hashedPassword: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'admins',
    timestamps: false
});

export default Admin;
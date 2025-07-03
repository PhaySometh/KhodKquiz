import sequelize from "../config/db/sequelize.js";
import { DataTypes } from "sequelize";

const Admin = sequelize.define('Admin', {
    username: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    hashPassword: {
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
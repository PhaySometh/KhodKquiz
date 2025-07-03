import sequelize from "../config/db/sequelize.js";
import { DataTypes } from "sequelize";

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
		allowNull: true
    },
    provider: {
        type: DataTypes.STRING,
		defaultValue: 'local'
    },
    picture: {
        type: DataTypes.TEXT
    },
    googleId: {
        type: DataTypes.TEXT
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
}, {
	tableName: 'users',
	timestamps: false
});

export default User;
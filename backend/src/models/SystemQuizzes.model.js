import sequelize from "../config/db/sequelize.js";
import { DataTypes, INTEGER } from "sequelize";

const SystemQuizzes = sequelize.define('SystemQuizzes', {
    title: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    category: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    createdBy: {
        type: DataTypes.INTEGER,
        references: {
            model: 'admins',
            key: 'id'
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
}, {
    tableName: 'systemQuizzes',
    timestamps: false
});

export default SystemQuizzes;
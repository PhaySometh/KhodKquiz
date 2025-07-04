import sequelize from "../config/db/sequelize.js";
import { DataTypes, DATE } from "sequelize";

const SystemQuizResult = sequelize.define('SystemQuizResult', {
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    systemQuizId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'systemQuizzes',
            key: 'id'
        }
    },
    score: {
        type: DataTypes.DECIMAL(9,2),
        allowNull: false
    },
    takenAt: {
        type: DataTypes.DATE
    }
}, {
    modelName: 'systemQuizResult',
    timestamps: false
})

export default SystemQuizResult;
import { DataTypes } from "sequelize";
import sequelize from "../config/db/sequelize";

const SystemQuestions = sequelize.define('SystemQuestions', {
    systemQuizId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'systemQuizzes',
            key: 'id'
        }
    },
    text: {
        type: DataTypes.TEXT
    },
}, {
    tableName: 'systemQuestions',
    timestamps: false
});

export default SystemQuestions;
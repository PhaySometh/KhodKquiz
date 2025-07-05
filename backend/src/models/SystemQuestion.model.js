import { DataTypes } from "sequelize";
import sequelize from "../config/db/sequelize.js";

const SystemQuestion = sequelize.define('SystemQuestion', {
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

export default SystemQuestion;
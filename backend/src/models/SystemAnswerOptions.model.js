import sequelize from "../config/db/sequelize.js";
import { DataTypes } from "sequelize";

const SystemAnswerOptions = sequelize.define('SystemAnswerOptions', {
    systemQuestionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'systemQuestions',
            key: 'id'
        }
    },
    text: {
        type: DataTypes.TEXT
    },
    isCorrect: {
        type: DataTypes.BOOLEAN
    }
}, {
    modelName: 'systemAnswerOptions',
    timestamps: false
})

export default SystemAnswerOptions;
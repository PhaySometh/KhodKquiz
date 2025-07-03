import { DataTypes } from 'sequelize';
import sequelize from '../config/db/sequelize.js';

// Four multiple-choice options for each question. Only one option should have isCorrect = TRUE
const AnswerOption = sequelize.define('AnswerOption', {
    questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'questions',
            key: 'id',
            onDelete: 'CASCADE'     // If a question is deleted, its options go too
        },
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    isCorrect: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'answerOptions',
    timestamps: false,
});

export default AnswerOption;
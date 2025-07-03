import { DataTypes } from 'sequelize';
import sequelize from '../config/db/sequelize.js';

// A question inside a quiz
const Question = sequelize.define('Question', {
    quizId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'quizzes',
            key: 'id',
        },
        onDelete: 'CASCADE'     // If a quiz is deleted, its related questions are also removed.
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: 'questions',
    timestamps: false,
});

export default Question;
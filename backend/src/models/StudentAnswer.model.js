import { DataTypes } from 'sequelize';
import sequelize from '../config/db/sequelize.js';

// Stores what option a student selected for a question
const StudentAnswer = sequelize.define('StudentAnswer', {
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
        onDelete: 'CASCADE'
    },
    questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'questions',
            key: 'id',
        },
        onDelete: 'CASCADE'
    },
    selectedOptionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'answerOptions',
            key: 'id',
        },
        onDelete: 'CASCADE'     // Clean up if an answer option is removed
    },
    answeredAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'studentAnswers',
    timestamps: false,
    indexes: [      // Ensure a student answers each question only once
        {
            unique: true,
            fields: ['studentId', 'questionId']
        }
    ]
});

export default StudentAnswer;
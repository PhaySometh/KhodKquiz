import { DataTypes } from 'sequelize';
import sequelize from '../config/db/sequelize.js';

// Stores the final score of a student after taking a quiz
const QuizResult = sequelize.define('QuizResult', {
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
        onDelete: 'CASCADE'
    },
    quizId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'quizzes',
            key: 'id',
        },
        onDelete: 'CASCADE'
    },
    score: {
        type: DataTypes.DECIMAL(9, 2),
        allowNull: true,
    },
    takenAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'quizResults',
    timestamps: false,
    indexes: [      // To prevent multiple results for the same student on one quiz
        {
            unique: true,
            fields: ['studentId', 'quizId']
        }
    ]
});

export default QuizResult;
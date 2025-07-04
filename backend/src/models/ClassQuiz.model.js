import sequelize from "../config/db/sequelize.js";
import { DataTypes } from "sequelize";

// Assigns quizzes to specific classes
const ClassQuiz = sequelize.define('ClassQuiz', {
    classId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'classes',
            key: 'id',
        },
        onDelete: 'CASCADE'     // If a class or quiz is deleted, related records in this table are also removed automatically.
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
    assignedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
}, {
    tableName: 'classQuizzes',
    timestamps: false,
    indexes: [      // To prevent assigning the same quiz multiple times to the same class
        {
            unique: true,
            fields: ['classId', 'quizId']
        }
    ]
});

export default ClassQuiz;

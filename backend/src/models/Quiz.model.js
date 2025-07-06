import sequelize from "../config/db/sequelize.js";
import { DataTypes } from "sequelize";

// A quiz created by a teacher
const Quiz = sequelize.define('Quiz', {
    title: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    createdBy: {    // Created by teacher
        type: DataTypes.INTEGER,
        references: {
            model: 'users', 
            key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE'     // To clean up quizzes if the teacher is removed
    },
    time: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    }
}, {
    tableName: 'quizzes',
    timestamps: false   // Disable updatedAt if not needed
});

export default Quiz;
/**
 * ClassQuiz Model - Class-Quiz Associations
 * 
 * This model links quizzes to the classes they are assigned to.
 * 
 * Database Table: classQuizzes
 * 
 * Business Rules:
 * - Each record connects one class to one quiz.
 * - Duplicate assignments of the same quiz to the same class are prevented by a unique index.
 * - When a class or quiz is deleted, associated assignments are also deleted (CASCADE).
 * - `assignedAt` records when the quiz was assigned to the class.
 * 
 * Use Cases:
 * - Managing which quizzes are available to which classes.
 * - Controlling quiz distribution and access within the system.
 * 
 * @version 1.0.0
 * @author KhodKquiz Team
 */

import sequelize from "../config/db/sequelize.js";
import { DataTypes } from "sequelize";

/**
 * ClassQuiz Model Definition
 * 
 * Stores records of quizzes assigned to classes.
 */
const ClassQuiz = sequelize.define('ClassQuiz', {
    /**
     * Class ID - Foreign key referencing the target class.
     */
    classId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'classes',
            key: 'id',
        },
        onDelete: 'CASCADE',  // Clean up if the class is deleted
        comment: 'ID of the class receiving the quiz'
    },

    /**
     * Quiz ID - Foreign key referencing the assigned quiz.
     */
    quizId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'quizzes',
            key: 'id',
        },
        onDelete: 'CASCADE',  // Clean up if the quiz is deleted
        comment: 'ID of the quiz assigned to the class'
    },

    /**
     * Assigned At - Timestamp of when the quiz was assigned.
     */
    assignedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        comment: 'Date/time when the quiz was assigned to the class'
    },
}, {
    tableName: 'classQuizzes',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['classId', 'quizId'],
            name: 'unique_class_quiz_assignment'
        }
    ],
    comment: 'Links quizzes to classes, ensuring each quiz is assigned only once per class'
});

export default ClassQuiz;
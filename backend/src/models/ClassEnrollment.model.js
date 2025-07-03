import sequelize from "../config/db/sequelize.js";
import { DataTypes } from "sequelize";

// Connects students to classes they join
const ClassEnrollment = sequelize.define('ClassEnrollment', {
    classId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'classes',
            key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE'     // If a class or student is deleted, clean up enrollment records.
    },
    studentId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE'
    },
    enrolledAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'classEnrollments',
    timestamps: false,
    indexes: [      //  To prevent duplicate enrollments
        {
            unique: true,
            fields: ['classId', 'studentId']
        }
    ]
});

export default ClassEnrollment;
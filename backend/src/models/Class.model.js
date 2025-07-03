import sequelize from "../config/db/sequelize";
import { DataTypes } from "sequelize";

// Each class is created by a teacher
const Class = sequelize.define('Class', {
    name: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    teacherId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'     // All classes are deleted if the teacher is removed.
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'classes',
    timestamps: false
});

export default Class;
import sequelize from '../config/db/sequelize.js';
import { DataTypes } from 'sequelize';

/**
 * SystemCategory Model Definition
 *
 * Represents a category for system quizzes.
 */
export default (sequelize) => {
    return sequelize.define(
        'SystemCategory',
        {
            /**
             * Name - The name of the category.
             */
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
                comment: 'Name of the system quiz category',
            },

            /**
             * Description - Additional details about the category.
             */
            description: {
                type: DataTypes.TEXT,
                comment: 'Detailed description of the category',
            },

            /**
             * Icon - URL or path to the category icon/image.
             */
            icon: {
                type: DataTypes.STRING(500),
                allowNull: true,
                comment: 'URL or file path to the category icon/image',
            },
        },
        {
            tableName: 'systemCategories',
            timestamps: false,
            comment: 'Categories for system-generated quizzes',
        }
    );
};

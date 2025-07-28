/**
 * Database Migration: Add Icon Field to SystemCategory
 *
 * Adds the icon field to the systemCategories table to support
 * category icon uploads and display functionality.
 *
 * Usage: node backend/src/migrations/add-category-icon.js
 *
 * @version 2.0.0
 * @author KhodKquiz Team
 */

import createSequelizeInstance from '../config/db/sequelize.js';
import { DataTypes } from 'sequelize';

/**
 * Adds icon column to systemCategories table
 */
async function addIconColumn() {
    const sequelize = createSequelizeInstance();
    try {
        console.log(
            '🔄 Starting migration: Add icon field to systemCategories...'
        );

        // Connect to database
        await sequelize.authenticate();
        console.log('✅ Database connection established');

        // Check if column already exists
        const [results] = await sequelize.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'systemCategories' 
            AND COLUMN_NAME = 'icon'
        `);

        if (results.length > 0) {
            console.log('⏭️  Icon column already exists, skipping migration');
            return;
        }

        // Add the icon column
        await sequelize
            .getQueryInterface()
            .addColumn('systemCategories', 'icon', {
                type: DataTypes.STRING(500),
                allowNull: true,
                comment: 'URL or file path to the category icon/image',
            });

        console.log(
            '✅ Successfully added icon column to systemCategories table'
        );

        // Verify the column was added
        const [verifyResults] = await sequelize.query(`
            SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_COMMENT
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'systemCategories' 
            AND COLUMN_NAME = 'icon'
        `);

        if (verifyResults.length > 0) {
            console.log('✅ Migration verified successfully');
            console.log('📊 Column details:', verifyResults[0]);
        } else {
            throw new Error('Migration verification failed');
        }
    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    } finally {
        await sequelize.close();
        console.log('🔌 Database connection closed');
    }
}

/**
 * Removes icon column from systemCategories table (rollback)
 */
async function removeIconColumn() {
    const sequelize = createSequelizeInstance();
    try {
        console.log(
            '🔄 Starting rollback: Remove icon field from systemCategories...'
        );

        // Connect to database
        await sequelize.authenticate();
        console.log('✅ Database connection established');

        // Check if column exists
        const [results] = await sequelize.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'systemCategories' 
            AND COLUMN_NAME = 'icon'
        `);

        if (results.length === 0) {
            console.log('⏭️  Icon column does not exist, nothing to rollback');
            return;
        }

        // Remove the icon column
        await sequelize
            .getQueryInterface()
            .removeColumn('systemCategories', 'icon');

        console.log(
            '✅ Successfully removed icon column from systemCategories table'
        );
    } catch (error) {
        console.error('❌ Rollback failed:', error);
        throw error;
    } finally {
        await sequelize.close();
        console.log('🔌 Database connection closed');
    }
}

/**
 * Shows current table structure
 */
async function showTableStructure() {
    const sequelize = createSequelizeInstance();
    try {
        console.log('📊 Current systemCategories table structure:');

        await sequelize.authenticate();

        const [results] = await sequelize.query(`
            SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, COLUMN_COMMENT
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'systemCategories'
            ORDER BY ORDINAL_POSITION
        `);

        console.table(results);
    } catch (error) {
        console.error('❌ Error showing table structure:', error);
    } finally {
        await sequelize.close();
    }
}

/**
 * Main execution function
 */
async function main() {
    const command = process.argv[2];

    console.log('🚀 SystemCategory Icon Migration Tool');
    console.log('====================================\n');

    try {
        switch (command) {
            case 'up':
            case 'migrate':
                await addIconColumn();
                break;

            case 'down':
            case 'rollback':
                await removeIconColumn();
                break;

            case 'status':
            case 'show':
                await showTableStructure();
                break;

            default:
                console.log('📖 Usage:');
                console.log(
                    '  node add-category-icon.js up       # Add icon column'
                );
                console.log(
                    '  node add-category-icon.js down     # Remove icon column'
                );
                console.log(
                    '  node add-category-icon.js status   # Show table structure'
                );
                console.log('');

                // Default to migration
                await addIconColumn();
                break;
        }

        console.log('\n✅ Migration completed successfully!');
    } catch (error) {
        console.error('\n💥 Migration failed:', error.message);
        process.exit(1);
    }
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { addIconColumn, removeIconColumn, showTableStructure };

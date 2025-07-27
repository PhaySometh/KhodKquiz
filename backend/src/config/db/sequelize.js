import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Creates a Sequelize instance using the main database owner credentials.
 * RBAC is handled at the application level through middleware, not database level.
 * This ensures all operations have proper database permissions.
 *
 * @returns {Sequelize} A configured Sequelize instance
 */
const createSequelizeInstance = () => {
    // Always use the database owner credentials to avoid permission issues
    // RBAC is enforced at the application level through authentication middleware
    const username = process.env.PGUSER;
    const password = process.env.PGPASSWORD;

    return new Sequelize(
        process.env.PGDATABASE, // Database name
        username, // Database owner username
        password, // Database owner password
        {
            host: process.env.PGHOST,
            dialect: 'postgres',
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false,
                },
            },
            logging: false, // Set to true if you want to debug SQL
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000,
            },
        }
    );
};

export default createSequelizeInstance;

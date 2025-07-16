import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Creates a new Sequelize instance based on the user role.
 * @param {'admin' | 'teacher' | 'student'} role
 * @returns {Sequelize} A configured Sequelize instance
 */
const createSequelizeInstance = (role) => {
    let username, password;

    switch (role) {
        case 'student':
            username = process.env.PG_STUDENT_USER;
            password = process.env.PG_STUDENT_PASSWORD;
            break;
        case 'teacher':
            username = process.env.PG_TEACHER_USER;
            password = process.env.PG_TEACHER_PASSWORD;
            break;
        case 'admin':
        default:
            username = process.env.PGUSER;
            password = process.env.PGPASSWORD;
            break;
    }

    // return new Sequelize(
    //     process.env.PGDATABASE,  // Database name
    //     username,                // Role-specific username
    //     password,                // Role-specific password
    //     {
    //         host: process.env.PGHOST,
    //         dialect: 'postgres',
    //         dialectOptions: {
    //             ssl: {
    //                 require: true,
    //                 rejectUnauthorized: false,
    //             },
    //         },
    //         logging: false, // Set to true if you want to debug SQL
    //     }
    // );
    return new Sequelize(
        'codequiz',  // Database name
        'root',                // Role-specific username
        'rootAdmin123',                // Role-specific password
        {
            host: 'localhost',
            port: 3306,
            dialect: 'mysql',
            logging: false, // Set to true if you want to debug SQL
        }
    );
};

export default createSequelizeInstance;
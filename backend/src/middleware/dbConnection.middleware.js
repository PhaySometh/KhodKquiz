import createSequelizeInstance from '../config/db/sequelize.js';

/**
 * Middleware that attaches a Sequelize instance to req.db
 * Uses database owner credentials for all operations to avoid permission issues
 * RBAC is enforced at the application level through authentication middleware
 */
export const dbConnectionMiddleware = (req, res, next) => {
    // Use a single database connection with owner privileges
    // Role-based access control is handled by authentication middleware
    req.db = createSequelizeInstance();
    next();
};

import createSequelizeInstance from '../config/db/sequelize.js';

/**
 * Middleware that attaches a role-based Sequelize instance to req.db
 */
export const dbConnectionMiddleware = (req, res, next) => {
    const role = req.user?.role || 'student'; // default to 'student' if no user role
    req.db = createSequelizeInstance(role);
    next();
};
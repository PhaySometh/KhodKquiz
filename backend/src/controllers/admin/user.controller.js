/**
 * Admin User Management Controller
 *
 * Handles admin-only user management operations including:
 * - User CRUD operations
 * - Role assignments and management
 * - User statistics and analytics
 * - Account status management
 *
 * @version 1.0.0
 * @author KhodKquiz Team
 */

import setUpModels from '../../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';

/**
 * Get all users with advanced filtering, pagination, and search
 */
export const getAllUsers = async (req, res) => {
    try {
        const model = setUpModels(req.db);

        // Extract query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const role = req.query.role || '';
        const provider = req.query.provider || '';
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder || 'DESC';
        const offset = (page - 1) * limit;

        // Build where clause for filtering
        const whereClause = {};

        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } },
            ];
        }

        if (role && ['student', 'teacher', 'admin'].includes(role)) {
            whereClause.role = role;
        }

        if (provider && ['local', 'google'].includes(provider)) {
            whereClause.provider = provider;
        }

        // Get users with pagination and filtering
        const users = await model.User.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            attributes: [
                'id',
                'name',
                'email',
                'picture',
                'role',
                'provider',
                'createdAt',
                'googleId',
            ],
            order: [[sortBy, sortOrder.toUpperCase()]],
        });

        // Calculate additional statistics
        const totalUsers = users.count;
        const totalPages = Math.ceil(totalUsers / limit);

        res.json({
            success: true,
            data: {
                users: users.rows,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalUsers,
                    limit,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1,
                },
            },
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message,
        });
    }
};

/**
 * Get user statistics for admin dashboard
 */
export const getUserStatistics = async (req, res) => {
    try {
        const model = setUpModels(req.db);

        // Get user counts by role
        const userStats = await model.User.findAll({
            attributes: [
                'role',
                [model.User.sequelize.fn('COUNT', '*'), 'count'],
            ],
            group: ['role'],
        });

        // Get user counts by provider
        const providerStats = await model.User.findAll({
            attributes: [
                'provider',
                [model.User.sequelize.fn('COUNT', '*'), 'count'],
            ],
            group: ['provider'],
        });

        // Get recent user registrations (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentUsers = await model.User.count({
            where: {
                createdAt: {
                    [Op.gte]: thirtyDaysAgo,
                },
            },
        });

        // Get total user count
        const totalUsers = await model.User.count();

        // Format statistics
        const roleStats = {
            student: 0,
            teacher: 0,
            admin: 0,
        };

        userStats.forEach((stat) => {
            const role = stat.dataValues.role;
            const count = parseInt(stat.dataValues.count);
            roleStats[role] = count;
        });

        const providerStatsFormatted = {
            local: 0,
            google: 0,
        };

        providerStats.forEach((stat) => {
            const provider = stat.dataValues.provider;
            const count = parseInt(stat.dataValues.count);
            providerStatsFormatted[provider] = count;
        });

        res.json({
            success: true,
            data: {
                totalUsers,
                recentUsers,
                roleDistribution: roleStats,
                providerDistribution: providerStatsFormatted,
                growthRate:
                    totalUsers > 0
                        ? ((recentUsers / totalUsers) * 100).toFixed(2)
                        : 0,
            },
        });
    } catch (error) {
        console.error('Error fetching user statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user statistics',
            error: error.message,
        });
    }
};

/**
 * Update user role (admin only)
 */
export const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;
        const adminId = req.user.id;

        // Validate role
        if (!role || !['student', 'teacher', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be student, teacher, or admin',
            });
        }

        const model = setUpModels(req.db);

        // Check if user exists
        const user = await model.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Prevent admin from changing their own role
        if (parseInt(userId) === adminId) {
            return res.status(403).json({
                success: false,
                message: 'Cannot change your own role',
            });
        }

        // Update user role
        await user.update({ role });

        res.json({
            success: true,
            message: `User role updated to ${role} successfully`,
            data: {
                userId: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user role',
            error: error.message,
        });
    }
};

/**
 * Get user by ID with detailed information
 */
export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const model = setUpModels(req.db);

        const user = await model.User.findByPk(userId, {
            attributes: [
                'id',
                'name',
                'email',
                'picture',
                'role',
                'provider',
                'createdAt',
                'googleId',
            ],
            include: [
                {
                    model: model.TeacherApplication,
                    as: 'teacherApplications',
                    attributes: ['id', 'status', 'createdAt', 'reviewedAt'],
                },
            ],
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user',
            error: error.message,
        });
    }
};

/**
 * Delete user account (admin only)
 */
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const adminId = req.user.id;
        const model = setUpModels(req.db);

        // Check if user exists
        const user = await model.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Prevent admin from deleting their own account
        if (parseInt(userId) === adminId) {
            return res.status(403).json({
                success: false,
                message: 'Cannot delete your own account',
            });
        }

        // Prevent deletion of other admin accounts
        if (user.role === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Cannot delete admin accounts',
            });
        }

        // Delete user (cascade will handle related records)
        await user.destroy();

        res.json({
            success: true,
            message: 'User account deleted successfully',
            data: {
                deletedUserId: userId,
                deletedUserName: user.name,
                deletedUserEmail: user.email,
            },
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete user',
            error: error.message,
        });
    }
};

/**
 * Create new user account (admin only)
 */
export const createUser = async (req, res) => {
    try {
        const { name, email, password, role = 'student' } = req.body;
        const model = setUpModels(req.db);

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required',
            });
        }

        // Validate role
        if (!['student', 'teacher', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be student, teacher, or admin',
            });
        }

        // Check if user already exists
        const existingUser = await model.User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered',
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = await model.User.create({
            name: name.trim(),
            email: email.toLowerCase(),
            password: hashedPassword,
            role,
            provider: 'local',
        });

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                provider: user.provider,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create user',
            error: error.message,
        });
    }
};

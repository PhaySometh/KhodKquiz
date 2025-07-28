/**
 * Admin Analytics Controller
 *
 * Handles analytics and statistics endpoints for admin dashboard including:
 * - System-wide statistics
 * - Quiz performance metrics
 * - User engagement analytics
 * - Teacher application statistics
 *
 * @version 1.0.0
 * @author KhodKquiz Team
 */

import setUpModels from '../../models/index.js';
import { Op } from 'sequelize';

/**
 * Get comprehensive dashboard statistics
 */
export const getDashboardStats = async (req, res) => {
    try {
        const model = setUpModels(req.db);

        // Get current date for time-based calculations
        const now = new Date();
        const thirtyDaysAgo = new Date(
            now.getTime() - 30 * 24 * 60 * 60 * 1000
        );
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // User statistics
        const totalUsers = await model.User.count();
        const newUsersThisMonth = await model.User.count({
            where: { createdAt: { [Op.gte]: thirtyDaysAgo } },
        });
        const newUsersThisWeek = await model.User.count({
            where: { createdAt: { [Op.gte]: sevenDaysAgo } },
        });

        // User role distribution
        const userRoleStats = await model.User.findAll({
            attributes: [
                'role',
                [model.User.sequelize.fn('COUNT', '*'), 'count'],
            ],
            group: ['role'],
        });

        // Quiz statistics
        const totalQuizzes = await model.SystemQuiz.count();
        const newQuizzesThisMonth = await model.SystemQuiz.count({
            where: { createdAt: { [Op.gte]: thirtyDaysAgo } },
        });

        // Quiz attempts statistics
        const totalQuizAttempts = await model.SystemQuizResult.count();
        const quizAttemptsThisMonth = await model.SystemQuizResult.count({
            where: { completedAt: { [Op.gte]: thirtyDaysAgo } },
        });

        // Category statistics
        const totalCategories = await model.SystemCategory.count();

        // Teacher application statistics
        const teacherApplicationStats = await model.TeacherApplication.findAll({
            attributes: [
                'status',
                [model.TeacherApplication.sequelize.fn('COUNT', '*'), 'count'],
            ],
            group: ['status'],
        });

        // Format role statistics
        const roleDistribution = {
            student: 0,
            teacher: 0,
            admin: 0,
        };

        userRoleStats.forEach((stat) => {
            const role = stat.dataValues.role;
            const count = parseInt(stat.dataValues.count);
            roleDistribution[role] = count;
        });

        // Format teacher application statistics
        const applicationStats = {
            pending: 0,
            approved: 0,
            rejected: 0,
            total: 0,
        };

        teacherApplicationStats.forEach((stat) => {
            const status = stat.dataValues.status;
            const count = parseInt(stat.dataValues.count);
            applicationStats[status] = count;
            applicationStats.total += count;
        });

        // Calculate growth rates
        const userGrowthRate =
            totalUsers > 0
                ? ((newUsersThisMonth / totalUsers) * 100).toFixed(2)
                : 0;
        const quizGrowthRate =
            totalQuizzes > 0
                ? ((newQuizzesThisMonth / totalQuizzes) * 100).toFixed(2)
                : 0;

        res.json({
            success: true,
            data: {
                overview: {
                    totalUsers,
                    totalQuizzes,
                    totalCategories,
                    totalQuizAttempts,
                    newUsersThisMonth,
                    newUsersThisWeek,
                    newQuizzesThisMonth,
                    quizAttemptsThisMonth,
                    userGrowthRate: parseFloat(userGrowthRate),
                    quizGrowthRate: parseFloat(quizGrowthRate),
                },
                userDistribution: roleDistribution,
                teacherApplications: applicationStats,
                trends: {
                    userGrowth: {
                        thisWeek: newUsersThisWeek,
                        thisMonth: newUsersThisMonth,
                        growthRate: parseFloat(userGrowthRate),
                    },
                    quizActivity: {
                        attemptsThisMonth: quizAttemptsThisMonth,
                        newQuizzesThisMonth,
                        growthRate: parseFloat(quizGrowthRate),
                    },
                },
            },
        });
    } catch (error) {
        console.error('Error fetching dashboard statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics',
            error: error.message,
        });
    }
};

/**
 * Get quiz performance analytics
 */
export const getQuizAnalytics = async (req, res) => {
    try {
        const model = setUpModels(req.db);

        // Get basic quiz information
        const quizzes = await model.SystemQuiz.findAll({
            attributes: ['id', 'title', 'difficulty', 'category'],
            include: [
                {
                    model: model.SystemCategory,
                    attributes: ['name'],
                },
            ],
        });

        // Get quiz performance data separately
        const quizPerformance = [];
        for (const quiz of quizzes) {
            const results = await model.SystemQuizResult.findAll({
                where: { systemQuizId: quiz.id },
                attributes: [
                    [
                        model.SystemQuizResult.sequelize.fn('COUNT', '*'),
                        'attemptCount',
                    ],
                    [
                        model.SystemQuizResult.sequelize.fn(
                            'AVG',
                            model.SystemQuizResult.sequelize.col('score')
                        ),
                        'averageScore',
                    ],
                    [
                        model.SystemQuizResult.sequelize.fn(
                            'AVG',
                            model.SystemQuizResult.sequelize.literal(
                                '("correctAnswers" * 100.0 / "totalQuestions")'
                            )
                        ),
                        'averageAccuracy',
                    ],
                ],
                raw: true,
            });

            const stats = results[0] || {
                attemptCount: 0,
                averageScore: 0,
                averageAccuracy: 0,
            };

            quizPerformance.push({
                id: quiz.id,
                title: quiz.title,
                difficulty: quiz.difficulty,
                categoryName: quiz.SystemCategory?.name || 'Uncategorized',
                attemptCount: parseInt(stats.attemptCount) || 0,
                averageScore: parseFloat(stats.averageScore) || 0,
                averageAccuracy: parseFloat(stats.averageAccuracy) || 0,
            });
        }

        // Get category performance
        const categories = await model.SystemCategory.findAll({
            attributes: ['id', 'name'],
        });

        const categoryPerformance = [];
        for (const category of categories) {
            const quizCount = await model.SystemQuiz.count({
                where: { category: category.id },
            });

            const totalAttempts = await model.SystemQuizResult.count({
                include: [
                    {
                        model: model.SystemQuiz,
                        where: { category: category.id },
                        attributes: [],
                    },
                ],
            });

            const avgScoreResult = await model.SystemQuizResult.findAll({
                attributes: [
                    [
                        model.SystemQuizResult.sequelize.fn(
                            'AVG',
                            model.SystemQuizResult.sequelize.col('score')
                        ),
                        'averageScore',
                    ],
                ],
                include: [
                    {
                        model: model.SystemQuiz,
                        where: { category: category.id },
                        attributes: [],
                    },
                ],
                raw: true,
            });

            categoryPerformance.push({
                id: category.id,
                name: category.name,
                quizCount,
                totalAttempts,
                averageScore: parseFloat(avgScoreResult[0]?.averageScore) || 0,
            });
        }

        res.json({
            success: true,
            data: {
                quizPerformance,
                categoryPerformance,
            },
        });
    } catch (error) {
        console.error('Error fetching quiz analytics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch quiz analytics',
            error: error.message,
        });
    }
};

/**
 * Get user engagement analytics
 */
export const getUserEngagementAnalytics = async (req, res) => {
    try {
        const model = setUpModels(req.db);

        // Get user activity over time (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Daily user registrations
        const dailyRegistrations = await model.User.findAll({
            attributes: [
                [
                    model.User.sequelize.fn(
                        'DATE',
                        model.User.sequelize.col('createdAt')
                    ),
                    'date',
                ],
                [model.User.sequelize.fn('COUNT', '*'), 'count'],
            ],
            where: {
                createdAt: { [Op.gte]: thirtyDaysAgo },
            },
            group: [
                model.User.sequelize.fn(
                    'DATE',
                    model.User.sequelize.col('createdAt')
                ),
            ],
            order: [
                [
                    model.User.sequelize.fn(
                        'DATE',
                        model.User.sequelize.col('createdAt')
                    ),
                    'ASC',
                ],
            ],
        });

        // Daily quiz attempts
        const dailyQuizAttempts = await model.SystemQuizResult.findAll({
            attributes: [
                [
                    model.SystemQuizResult.sequelize.fn(
                        'DATE',
                        model.SystemQuizResult.sequelize.col('completedAt')
                    ),
                    'date',
                ],
                [model.SystemQuizResult.sequelize.fn('COUNT', '*'), 'count'],
            ],
            where: {
                completedAt: { [Op.gte]: thirtyDaysAgo },
            },
            group: [
                model.SystemQuizResult.sequelize.fn(
                    'DATE',
                    model.SystemQuizResult.sequelize.col('completedAt')
                ),
            ],
            order: [
                [
                    model.SystemQuizResult.sequelize.fn(
                        'DATE',
                        model.SystemQuizResult.sequelize.col('completedAt')
                    ),
                    'ASC',
                ],
            ],
        });

        // Most active users - simplified approach
        const users = await model.User.findAll({
            attributes: ['id', 'name', 'email', 'role'],
        });

        const mostActiveUsers = [];
        for (const user of users) {
            const quizAttempts = await model.SystemQuizResult.count({
                where: { studentId: user.id },
            });

            if (quizAttempts > 0) {
                mostActiveUsers.push({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    quizAttempts,
                });
            }
        }

        // Sort by quiz attempts and limit to top 10
        mostActiveUsers.sort((a, b) => b.quizAttempts - a.quizAttempts);
        const topActiveUsers = mostActiveUsers.slice(0, 10);

        res.json({
            success: true,
            data: {
                dailyRegistrations: dailyRegistrations.map((item) => ({
                    date: item.dataValues.date,
                    count: parseInt(item.dataValues.count),
                })),
                dailyQuizAttempts: dailyQuizAttempts.map((item) => ({
                    date: item.dataValues.date,
                    count: parseInt(item.dataValues.count),
                })),
                mostActiveUsers: topActiveUsers,
            },
        });
    } catch (error) {
        console.error('Error fetching user engagement analytics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user engagement analytics',
            error: error.message,
        });
    }
};

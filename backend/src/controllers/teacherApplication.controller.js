/**
 * Teacher Application Controller
 * 
 * Handles teacher role promotion requests including:
 * - Student application submission
 * - Admin review and approval/rejection
 * - Role promotion upon approval
 * 
 * @version 1.0.0
 * @author KhodKquiz Team
 */

import setUpModels from '../models/index.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Submit teacher application (Student only)
 */
export const submitTeacherApplication = async (req, res) => {
    try {
        const { institution, subject, experience, motivation } = req.body;
        const userId = req.user.id;

        // Validate input
        if (!institution || !subject || !experience || !motivation) {
            return res.status(400).json({ 
                error: 'All fields are required: institution, subject, experience, motivation' 
            });
        }

        // Validate user is a student
        if (req.user.role !== 'student') {
            return res.status(403).json({ 
                error: 'Only students can apply for teacher role' 
            });
        }

        const model = setUpModels(req.db);

        // Check if user already has a pending application
        const existingApplication = await model.TeacherApplication.findOne({
            where: { 
                userId: userId,
                status: 'pending'
            }
        });

        if (existingApplication) {
            return res.status(409).json({ 
                error: 'You already have a pending teacher application' 
            });
        }

        // Create new application
        const application = await model.TeacherApplication.create({
            userId,
            institution: institution.trim(),
            subject: subject.trim(),
            experience: experience.trim(),
            motivation: motivation.trim(),
            status: 'pending'
        });

        res.status(201).json({ 
            message: 'Teacher application submitted successfully',
            applicationId: application.id
        });

    } catch (error) {
        console.error('Error submitting teacher application:', error);
        res.status(500).json({ error: 'Failed to submit teacher application' });
    }
};

/**
 * Get all teacher applications (Admin only)
 */
export const getAllTeacherApplications = async (req, res) => {
    try {
        const model = setUpModels(req.db);
        
        // Get query parameters for filtering and pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status; // 'pending', 'approved', 'rejected'
        const offset = (page - 1) * limit;

        // Build where clause
        const whereClause = {};
        if (status && ['pending', 'approved', 'rejected'].includes(status)) {
            whereClause.status = status;
        }

        const applications = await model.TeacherApplication.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: model.User,
                    as: 'applicant',
                    attributes: ['id', 'name', 'email', 'picture', 'createdAt']
                },
                {
                    model: model.User,
                    as: 'reviewer',
                    attributes: ['id', 'name', 'email'],
                    required: false
                }
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        res.json({
            applications: applications.rows,
            totalPages: Math.ceil(applications.count / limit),
            currentPage: page,
            totalApplications: applications.count
        });

    } catch (error) {
        console.error('Error fetching teacher applications:', error);
        res.status(500).json({ error: 'Failed to fetch teacher applications' });
    }
};

/**
 * Get user's own teacher application status (Student only)
 */
export const getMyTeacherApplication = async (req, res) => {
    try {
        const userId = req.user.id;
        const model = setUpModels(req.db);

        const application = await model.TeacherApplication.findOne({
            where: { userId },
            include: [
                {
                    model: model.User,
                    as: 'reviewer',
                    attributes: ['id', 'name'],
                    required: false
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        if (!application) {
            return res.status(404).json({ 
                message: 'No teacher application found' 
            });
        }

        res.json({ application });

    } catch (error) {
        console.error('Error fetching user teacher application:', error);
        res.status(500).json({ error: 'Failed to fetch teacher application' });
    }
};

/**
 * Review teacher application - Approve or Reject (Admin only)
 */
export const reviewTeacherApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { action, adminNotes } = req.body; // action: 'approve' or 'reject'
        const reviewerId = req.user.id;

        // Validate input
        if (!action || !['approve', 'reject'].includes(action)) {
            return res.status(400).json({ 
                error: 'Action must be either "approve" or "reject"' 
            });
        }

        const model = setUpModels(req.db);

        // Find the application
        const application = await model.TeacherApplication.findOne({
            where: { 
                id: applicationId,
                status: 'pending'
            },
            include: [
                {
                    model: model.User,
                    as: 'applicant',
                    attributes: ['id', 'name', 'email', 'role']
                }
            ]
        });

        if (!application) {
            return res.status(404).json({ 
                error: 'Pending teacher application not found' 
            });
        }

        // Start transaction for atomic operations
        const transaction = await req.db.transaction();

        try {
            // Update application status
            await application.update({
                status: action === 'approve' ? 'approved' : 'rejected',
                adminNotes: adminNotes || null,
                reviewedBy: reviewerId,
                reviewedAt: new Date()
            }, { transaction });

            // If approved, promote user to teacher role
            if (action === 'approve') {
                await model.User.update(
                    { role: 'teacher' },
                    { 
                        where: { id: application.userId },
                        transaction 
                    }
                );
            }

            await transaction.commit();

            res.json({ 
                message: `Teacher application ${action}d successfully`,
                application: {
                    id: application.id,
                    status: action === 'approve' ? 'approved' : 'rejected',
                    applicantName: application.applicant.name,
                    reviewedAt: new Date()
                }
            });

        } catch (error) {
            await transaction.rollback();
            throw error;
        }

    } catch (error) {
        console.error('Error reviewing teacher application:', error);
        res.status(500).json({ error: 'Failed to review teacher application' });
    }
};

/**
 * Get teacher application statistics (Admin only)
 */
export const getTeacherApplicationStats = async (req, res) => {
    try {
        const model = setUpModels(req.db);

        const stats = await model.TeacherApplication.findAll({
            attributes: [
                'status',
                [model.TeacherApplication.sequelize.fn('COUNT', '*'), 'count']
            ],
            group: ['status']
        });

        const formattedStats = {
            pending: 0,
            approved: 0,
            rejected: 0,
            total: 0
        };

        stats.forEach(stat => {
            const status = stat.dataValues.status;
            const count = parseInt(stat.dataValues.count);
            formattedStats[status] = count;
            formattedStats.total += count;
        });

        res.json({ stats: formattedStats });

    } catch (error) {
        console.error('Error fetching teacher application stats:', error);
        res.status(500).json({ error: 'Failed to fetch application statistics' });
    }
};

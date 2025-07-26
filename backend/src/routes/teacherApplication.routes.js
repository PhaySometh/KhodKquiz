/**
 * Teacher Application Routes
 * 
 * Handles routing for teacher role promotion requests:
 * - Student application submission
 * - Admin review and management
 * - Application status tracking
 * 
 * @version 1.0.0
 * @author KhodKquiz Team
 */

import express from 'express';
import {
    submitTeacherApplication,
    getAllTeacherApplications,
    getMyTeacherApplication,
    reviewTeacherApplication,
    getTeacherApplicationStats
} from '../controllers/teacherApplication.controller.js';
import { authenticate, isAdmin, isStudent } from '../middleware/auth.middleware.js';
import { dbConnectionMiddleware } from '../middleware/dbConnection.middleware.js';

const router = express.Router();

// Apply middleware to all routes
router.use(authenticate);
router.use(dbConnectionMiddleware);

/**
 * Student Routes - Teacher Application Management
 */

// Submit teacher application (Students only)
router.post('/apply', isStudent, submitTeacherApplication);

// Get own application status (Students only)
router.get('/my-application', isStudent, getMyTeacherApplication);

/**
 * Admin Routes - Teacher Application Review
 */

// Get all teacher applications with filtering and pagination (Admin only)
router.get('/all', isAdmin, getAllTeacherApplications);

// Get application statistics (Admin only)
router.get('/stats', isAdmin, getTeacherApplicationStats);

// Review (approve/reject) teacher application (Admin only)
router.put('/review/:applicationId', isAdmin, reviewTeacherApplication);

export default router;

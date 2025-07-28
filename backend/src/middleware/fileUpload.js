/**
 * File Upload Middleware
 * 
 * Handles file uploads for category icons and other assets with:
 * - Multer configuration for file handling
 * - File type validation
 * - Size limits and security checks
 * - Organized directory structure
 * 
 * @version 2.0.0
 * @author KhodKquiz Team
 */

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory structure
const uploadsDir = path.join(__dirname, '../../uploads');
const categoryIconsDir = path.join(uploadsDir, 'category-icons');
const profilePicturesDir = path.join(uploadsDir, 'profile-pictures');

// Ensure directories exist
[uploadsDir, categoryIconsDir, profilePicturesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
    }
});

/**
 * Storage configuration for category icons
 */
const categoryIconStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, categoryIconsDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        const filename = `category-${uniqueSuffix}${extension}`;
        cb(null, filename);
    }
});

/**
 * File filter for category icons
 */
const categoryIconFilter = (req, file, cb) => {
    // Allowed file types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPG, PNG, and SVG files are allowed.'), false);
    }
};

/**
 * Multer configuration for category icons
 */
export const uploadCategoryIcon = multer({
    storage: categoryIconStorage,
    fileFilter: categoryIconFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1 // Only one file at a time
    }
});

/**
 * Storage configuration for profile pictures
 */
const profilePictureStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, profilePicturesDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        const filename = `profile-${uniqueSuffix}${extension}`;
        cb(null, filename);
    }
});

/**
 * File filter for profile pictures
 */
const profilePictureFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPG, PNG, and GIF files are allowed.'), false);
    }
};

/**
 * Multer configuration for profile pictures
 */
export const uploadProfilePicture = multer({
    storage: profilePictureStorage,
    fileFilter: profilePictureFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
        files: 1
    }
});

/**
 * Error handling middleware for file uploads
 */
export const handleUploadError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        switch (error.code) {
            case 'LIMIT_FILE_SIZE':
                return res.status(400).json({
                    success: false,
                    message: 'File too large. Maximum size is 5MB for category icons and 10MB for profile pictures.'
                });
            case 'LIMIT_FILE_COUNT':
                return res.status(400).json({
                    success: false,
                    message: 'Too many files. Only one file is allowed.'
                });
            case 'LIMIT_UNEXPECTED_FILE':
                return res.status(400).json({
                    success: false,
                    message: 'Unexpected file field.'
                });
            default:
                return res.status(400).json({
                    success: false,
                    message: 'File upload error: ' + error.message
                });
        }
    }
    
    if (error.message.includes('Invalid file type')) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    
    next(error);
};

/**
 * Utility function to delete uploaded file
 */
export const deleteUploadedFile = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`🗑️  Deleted file: ${filePath}`);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error deleting file:', error);
        return false;
    }
};

/**
 * Utility function to get file URL
 */
export const getFileUrl = (filename, type = 'category-icon') => {
    if (!filename) return null;
    
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    
    switch (type) {
        case 'category-icon':
            return `${baseUrl}/uploads/category-icons/${filename}`;
        case 'profile-picture':
            return `${baseUrl}/uploads/profile-pictures/${filename}`;
        default:
            return `${baseUrl}/uploads/${filename}`;
    }
};

/**
 * Utility function to extract filename from URL
 */
export const getFilenameFromUrl = (url) => {
    if (!url) return null;
    return path.basename(url);
};

/**
 * Utility function to get file path from filename
 */
export const getFilePath = (filename, type = 'category-icon') => {
    if (!filename) return null;
    
    switch (type) {
        case 'category-icon':
            return path.join(categoryIconsDir, filename);
        case 'profile-picture':
            return path.join(profilePicturesDir, filename);
        default:
            return path.join(uploadsDir, filename);
    }
};

/**
 * Middleware to serve uploaded files
 */
export const serveUploads = (req, res, next) => {
    const filePath = path.join(uploadsDir, req.path);
    
    // Security check - ensure file is within uploads directory
    if (!filePath.startsWith(uploadsDir)) {
        return res.status(403).json({
            success: false,
            message: 'Access denied'
        });
    }
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({
            success: false,
            message: 'File not found'
        });
    }
    
    // Serve the file
    res.sendFile(filePath);
};

export default {
    uploadCategoryIcon,
    uploadProfilePicture,
    handleUploadError,
    deleteUploadedFile,
    getFileUrl,
    getFilenameFromUrl,
    getFilePath,
    serveUploads
};

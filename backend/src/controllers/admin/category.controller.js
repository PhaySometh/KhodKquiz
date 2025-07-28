import setUpModels from '../../models/index.js';
import {
    getFileUrl,
    deleteUploadedFile,
    getFilenameFromUrl,
    getFilePath,
} from '../../middleware/fileUpload.js';

/**
 * Retrieves all system categories for admin management
 *
 * Returns all categories ordered by name, or empty array if none exist.
 * This endpoint is used by admin interfaces for category management.
 *
 * @async
 * @function getSystemCategories
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Array of categories or empty array
 */
export const getSystemCategories = async (req, res) => {
    try {
        const model = setUpModels(req.db);
        const categories = await model.SystemCategory.findAll({
            order: [['name', 'ASC']],
        });

        // Always return success with data array (empty if no categories)
        res.status(200).json({
            success: true,
            data: categories || [],
            count: categories ? categories.length : 0,
        });
    } catch (error) {
        console.error('Error in getSystemCategories:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            data: [],
        });
    }
};

export const getSystemCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const model = setUpModels(req.db);
        const category = await model.SystemCategory.findOne({
            where: { id },
        });
        if (!category) {
            return res
                .status(404)
                .json({ success: false, message: 'Category not found' });
        }

        res.status(200).json({ success: true, data: category });
    } catch (error) {
        console.error('Error in getSystemCategoryById:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

/**
 * Creates a new quiz category
 *
 * Validates input data, checks for duplicates, and creates a new category
 * with proper error handling and response formatting.
 *
 * @async
 * @function createCategory
 * @param {Object} req - Express request object
 * @param {Object} req.body - Category data
 * @param {string} req.body.name - Category name (required, 2-100 chars)
 * @param {string} req.body.description - Category description (optional)
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Created category data or error message
 */
export const createCategory = async (req, res) => {
    try {
        const model = setUpModels(req.db);
        const { name, description } = req.body;
        const uploadedFile = req.file;

        // Input validation
        if (!name || typeof name !== 'string') {
            // Clean up uploaded file if validation fails
            if (uploadedFile) {
                deleteUploadedFile(uploadedFile.path);
            }
            return res.status(400).json({
                success: false,
                message: 'Category name is required and must be a string',
            });
        }

        const trimmedName = name.trim();
        if (trimmedName.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Category name must be at least 2 characters long',
            });
        }

        if (trimmedName.length > 100) {
            return res.status(400).json({
                success: false,
                message: 'Category name must not exceed 100 characters',
            });
        }

        // Check for duplicate category names (case-insensitive)
        const existingCategory = await model.SystemCategory.findOne({
            where: {
                name: {
                    [model.Sequelize.Op.iLike]: trimmedName,
                },
            },
        });

        if (existingCategory) {
            return res.status(409).json({
                success: false,
                message: 'A category with this name already exists',
            });
        }

        // Prepare category data
        const categoryData = {
            name: trimmedName,
            description: description?.trim() || null,
            icon: uploadedFile
                ? getFileUrl(uploadedFile.filename, 'category-icon')
                : null,
        };

        // Create new category
        const newCategory = await model.SystemCategory.create(categoryData);

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: newCategory,
        });
    } catch (error) {
        console.error('Error in createCategory:', error);

        // Clean up uploaded file on error
        if (req.file) {
            deleteUploadedFile(req.file.path);
        }

        // Handle specific database errors
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors.map((err) => err.message),
            });
        }

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                success: false,
                message: 'Category name must be unique',
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const model = setUpModels(req.db);
        const { id } = req.params;
        const { name, description } = req.body;

        // Input validation
        if (!name || typeof name !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Category name is required and must be a string',
            });
        }

        const trimmedName = name.trim();
        if (trimmedName.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Category name must be at least 2 characters long',
            });
        }

        if (trimmedName.length > 100) {
            return res.status(400).json({
                success: false,
                message: 'Category name must not exceed 100 characters',
            });
        }

        // Check for duplicate category names (case-insensitive), excluding current category
        const existingCategory = await model.SystemCategory.findOne({
            where: {
                name: {
                    [model.Sequelize.Op.iLike]: trimmedName,
                },
                id: {
                    [model.Sequelize.Op.ne]: parseInt(id), // Exclude current category
                },
            },
        });

        if (existingCategory) {
            return res.status(409).json({
                success: false,
                message: 'A category with this name already exists',
            });
        }

        const [updatedRowsCount] = await model.SystemCategory.update(
            {
                name: trimmedName,
                description: description?.trim() || null,
            },
            {
                where: { id },
                returning: true,
            }
        );

        if (updatedRowsCount === 0) {
            return res
                .status(404)
                .json({ success: false, message: 'Category not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
        });
    } catch (error) {
        console.error('Error in updateCategory:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const model = setUpModels(req.db);
        const { id } = req.params;

        // Check if category has any quizzes (dependency checking)
        const quizCount = await model.SystemQuiz.count({
            where: { category: id },
        });

        if (quizCount > 0) {
            return res.status(409).json({
                success: false,
                message: `Cannot delete category. It contains ${quizCount} quizzes. Please move or delete the quizzes first.`,
                hasQuizzes: true,
                quizCount,
            });
        }

        const deletedRowsCount = await model.SystemCategory.destroy({
            where: { id },
        });

        if (deletedRowsCount === 0) {
            return res
                .status(404)
                .json({ success: false, message: 'Category not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
        });
    } catch (error) {
        console.error('Error in deleteCategory:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

import setUpModels from '../../../models/index.js';

/**
 * Retrieves all system categories for public/student access
 *
 * Returns all categories available for quiz assignment and browsing.
 * This endpoint is used by public interfaces and student/teacher forms.
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

/**
 * Get category details by ID
 * Returns specific category information
 */
/**
 * Get category details by ID
 * Returns specific category information for student access
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Category details or error message
 */
export const getSystemCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const model = setUpModels(req.db);
        const category = await model.SystemCategory.findByPk(id);

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
 * Get all quizzes for a specific category
 * Returns quizzes with category information for student access
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Array of quizzes or error message
 */
export const getQuizzesByCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const model = setUpModels(req.db);
        const quizzes = await model.SystemQuiz.findAll({
            where: { category: id },
            include: [
                {
                    model: model.SystemCategory,
                    attributes: ['name'],
                },
            ],
        });

        // Return empty array instead of 404 if no quizzes found
        res.status(200).json({
            success: true,
            data: quizzes,
            message:
                quizzes.length === 0
                    ? 'No quizzes found for this category'
                    : undefined,
        });
    } catch (error) {
        console.error('Error in getQuizzesByCategory:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

/**
 * Get quizzes by category with attempt status for authenticated users
 * Returns quiz list with attempt information for each quiz
 */
export const getQuizzesByCategoryWithAttempts = async (req, res) => {
    const { id } = req.params;
    const studentId = req.user?.id; // Optional - only available if authenticated

    try {
        const model = setUpModels(req.db);

        const quizzes = await model.SystemQuiz.findAll({
            where: { category: id },
            include: [
                {
                    model: model.SystemCategory,
                    attributes: ['name'],
                },
            ],
        });

        // If user is authenticated, get attempt information for each quiz
        let quizzesWithAttempts = [];
        if (studentId) {
            for (const quiz of quizzes) {
                // Get attempt count for this quiz
                const attemptCount = await model.SystemQuizResult.count({
                    where: { studentId, systemQuizId: quiz.id },
                });

                // Get latest attempt for result access
                const latestAttempt = await model.SystemQuizResult.findOne({
                    where: { studentId, systemQuizId: quiz.id },
                    order: [['attemptNumber', 'DESC']],
                });

                const canAttempt = attemptCount < 3;
                const remainingAttempts = Math.max(0, 3 - attemptCount);

                quizzesWithAttempts.push({
                    ...quiz.toJSON(),
                    attemptInfo: {
                        attemptCount,
                        remainingAttempts,
                        canAttempt,
                        maxAttempts: 3,
                        latestAttemptId: latestAttempt?.id || null,
                        hasAttempts: attemptCount > 0,
                    },
                });
            }
        } else {
            // For unauthenticated users, just return quizzes without attempt info
            quizzesWithAttempts = quizzes.map((quiz) => ({
                ...quiz.toJSON(),
                attemptInfo: null,
            }));
        }

        console.log(
            `Found ${quizzesWithAttempts.length} quizzes with attempt info for category ${id}`
        );

        res.status(200).json({
            success: true,
            data: quizzesWithAttempts,
            message:
                quizzesWithAttempts.length === 0
                    ? 'No quizzes found for this category'
                    : undefined,
        });
    } catch (error) {
        console.error('Error in getQuizzesByCategoryWithAttempts:', error);
        console.error('Error details:', {
            categoryId: id,
            studentId,
            message: error.message,
            stack: error.stack,
            name: error.name,
            sql: error.sql || 'No SQL query',
        });
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error:
                process.env.NODE_ENV === 'development'
                    ? error.message
                    : undefined,
        });
    }
};

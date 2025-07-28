/**
 * Admin Quiz Controller
 *
 * Handles all quiz management operations for administrators including:
 * - CRUD operations for quizzes and questions
 * - Bulk operations (delete, category reassignment)
 * - Import/Export functionality
 * - Quiz templates management
 *
 * @version 2.0.0
 * @author KhodKquiz Team
 */

import setUpModels from '../../models/index.js';

/**
 * Create a new quiz with questions and options
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Quiz data including title, description, questions, etc.
 * @param {Object} res - Express response object
 * @returns {Object} Created quiz data or error message
 */
export const createQuiz = async (req, res) => {
    const {
        title,
        description,
        createdBy,
        category,
        questions,
        time,
        difficulty,
        questionsCount,
    } = req.body;

    try {
        const model = setUpModels(req.db);
        const quiz = await model.SystemQuiz.create({
            title,
            description,
            createdBy,
            category,
            time,
            difficulty,
            questionsCount,
        });

        for (const questionData of questions) {
            const createdQuestion = await model.SystemQuestion.create({
                systemQuizId: quiz.id,
                text: questionData.question,
            });

            for (const optionData of questionData.options) {
                await model.SystemAnswerOption.create({
                    systemQuestionId: createdQuestion.id,
                    text: optionData.text,
                    isCorrect: optionData.isCorrect,
                });
            }
        }

        res.status(201).json({
            success: true,
            message: 'Quiz created successfully',
        });
    } catch (error) {
        console.error('Error creating quiz:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server error',
        });
    }
};

/**
 * Get quiz details by ID including questions and options
 *
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Quiz ID
 * @param {Object} res - Express response object
 * @returns {Object} Quiz details with questions and options or error message
 */
export const getQuizById = async (req, res) => {
    const { id } = req.params;
    try {
        const model = setUpModels(req.db);
        const quiz = await model.SystemQuiz.findOne({
            where: { id },
            include: [
                {
                    model: model.SystemCategory,
                    attributes: ['id', 'name'],
                    required: false,
                },
            ],
            exclude: [
                'createdAt',
                'updatedAt',
                'createdBy',
                'attempts',
                'averageAccuracy',
                'questionsCount',
            ],
        });
        if (!quiz) {
            return res
                .status(404)
                .json({ success: false, message: 'Quiz not found' });
        }

        const questions = await model.SystemQuestion.findAll({
            where: { systemQuizId: id },
            include: [
                {
                    model: model.SystemAnswerOption,
                    as: 'SystemAnswerOptions',
                    attributes: ['text', 'isCorrect'],
                },
            ],
            attributes: ['id', 'text'],
        });

        // Questions format
        const formattedQuestions = questions.map((q) => ({
            question: q.text,
            options: q.SystemAnswerOptions.map((o) => ({
                text: o.text,
                isCorrect: o.isCorrect,
            })),
        }));

        // Quiz format with category name
        const quizData = quiz.toJSON();
        quizData.questions = formattedQuestions;
        quizData.categoryName = quiz.SystemCategory?.name || 'Uncategorized';
        quizData.categoryId = quizData.category;

        res.status(200).json({ success: true, data: quizData });
    } catch (error) {
        console.error('Error in getQuizById:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

/**
 * Update existing quiz information
 *
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Quiz ID to update
 * @param {Object} req.body - Updated quiz data
 * @param {Object} res - Express response object
 * @returns {Object} Success message or error
 */
export const updateQuiz = async (req, res) => {
    const { id } = req.params;
    const {
        title,
        description,
        createdBy,
        category,
        questions,
        time,
        difficulty,
        questionsCount,
    } = req.body;

    try {
        const model = setUpModels(req.db);
        const [updatedRowsCount] = await model.SystemQuiz.update(
            {
                title,
                description,
                createdBy,
                category,
                time,
                difficulty,
                questionsCount,
            },
            {
                where: { id },
                returning: true,
            }
        );

        if (updatedRowsCount === 0) {
            return res
                .status(404)
                .json({ success: false, message: 'Quiz not found' });
        }

        await model.SystemQuestion.destroy({
            where: { systemQuizId: id },
        });

        for (const q of questions) {
            const question = await model.SystemQuestion.create({
                systemQuizId: id,
                text: q.question,
            });

            for (const opt of q.options) {
                await model.SystemAnswerOption.create({
                    systemQuestionId: question.id,
                    text: opt.text,
                    isCorrect: opt.isCorrect,
                });
            }
        }

        res.status(200).json({
            success: true,
            message: 'Quiz updated successfully',
        });
    } catch (error) {
        console.error('Error in updateQuiz:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

export const deleteQuiz = async (req, res) => {
    try {
        const model = setUpModels(req.db);
        const { id } = req.params;

        // Check if quiz has any results (dependency checking)
        const quizResults = await model.SystemQuizResult.count({
            where: { systemQuizId: id },
        });

        if (quizResults > 0) {
            return res.status(409).json({
                success: false,
                message: `Cannot delete quiz. It has ${quizResults} student results. Consider archiving instead.`,
                hasResults: true,
                resultCount: quizResults,
            });
        }

        const deletedRowsCount = await model.SystemQuiz.destroy({
            where: { id },
        });

        if (deletedRowsCount === 0) {
            return res
                .status(404)
                .json({ success: false, message: 'Quiz not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Quiz deleted successfully',
        });
    } catch (error) {
        console.error('Error in deleteQuiz:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

export const getQuizzes = async (req, res) => {
    try {
        const model = setUpModels(req.db);
        const quizzes = await model.SystemQuiz.findAll({
            include: [
                {
                    model: model.SystemCategory,
                    attributes: ['id', 'name'],
                    required: false, // LEFT JOIN to include quizzes without categories
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        if (!quizzes) {
            return res
                .status(404)
                .json({ success: false, message: 'No quizzes found' });
        }

        // Format quizzes with category names
        const formattedQuizzes = quizzes.map((quiz) => {
            const quizData = quiz.toJSON();
            return {
                ...quizData,
                categoryName: quiz.SystemCategory?.name || 'Uncategorized',
                // Also keep the original category ID for backward compatibility
                categoryId: quizData.category,
            };
        });

        res.status(200).json({ success: true, data: formattedQuizzes });
    } catch (error) {
        console.error('Error in getQuizzes:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

// Enhanced Quiz Management Endpoints

/**
 * Add questions to existing quiz
 */
export const addQuestionsToQuiz = async (req, res) => {
    try {
        const model = setUpModels(req.db);
        const { id } = req.params;
        const { questions } = req.body;

        if (!questions || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Questions array is required and cannot be empty',
            });
        }

        // Check if quiz exists
        const quiz = await model.SystemQuiz.findByPk(id);
        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found',
            });
        }

        // Add questions
        for (const q of questions) {
            const question = await model.SystemQuestion.create({
                systemQuizId: id,
                text: q.question,
            });

            for (const opt of q.options) {
                await model.SystemAnswerOption.create({
                    systemQuestionId: question.id,
                    text: opt.text,
                    isCorrect: opt.isCorrect,
                });
            }
        }

        // Update questions count
        const totalQuestions = await model.SystemQuestion.count({
            where: { systemQuizId: id },
        });

        await quiz.update({ questionsCount: totalQuestions });

        res.status(201).json({
            success: true,
            message: `${questions.length} questions added successfully`,
            totalQuestions,
        });
    } catch (error) {
        console.error('Error adding questions to quiz:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

/**
 * Update specific question in quiz
 */
export const updateQuizQuestion = async (req, res) => {
    try {
        const model = setUpModels(req.db);
        const { id, questionId } = req.params;
        const { question, options } = req.body;

        if (!question || !options || !Array.isArray(options)) {
            return res.status(400).json({
                success: false,
                message: 'Question text and options array are required',
            });
        }

        // Check if question belongs to the quiz
        const existingQuestion = await model.SystemQuestion.findOne({
            where: { id: questionId, systemQuizId: id },
        });

        if (!existingQuestion) {
            return res.status(404).json({
                success: false,
                message: 'Question not found in this quiz',
            });
        }

        // Update question text
        await existingQuestion.update({ text: question });

        // Delete existing options and create new ones
        await model.SystemAnswerOption.destroy({
            where: { systemQuestionId: questionId },
        });

        for (const opt of options) {
            await model.SystemAnswerOption.create({
                systemQuestionId: questionId,
                text: opt.text,
                isCorrect: opt.isCorrect,
            });
        }

        res.status(200).json({
            success: true,
            message: 'Question updated successfully',
        });
    } catch (error) {
        console.error('Error updating quiz question:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

/**
 * Delete specific question from quiz
 */
export const deleteQuizQuestion = async (req, res) => {
    try {
        const model = setUpModels(req.db);
        const { id, questionId } = req.params;

        // Check if question belongs to the quiz
        const question = await model.SystemQuestion.findOne({
            where: { id: questionId, systemQuizId: id },
        });

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found in this quiz',
            });
        }

        // Delete question (options will be deleted due to cascade)
        await question.destroy();

        // Update questions count
        const totalQuestions = await model.SystemQuestion.count({
            where: { systemQuizId: id },
        });

        await model.SystemQuiz.update(
            { questionsCount: totalQuestions },
            { where: { id } }
        );

        res.status(200).json({
            success: true,
            message: 'Question deleted successfully',
            totalQuestions,
        });
    } catch (error) {
        console.error('Error deleting quiz question:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

/**
 * Bulk operations for quiz management
 */
export const bulkDeleteQuizzes = async (req, res) => {
    try {
        const model = setUpModels(req.db);
        const { quizIds } = req.body;

        if (!quizIds || !Array.isArray(quizIds) || quizIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Quiz IDs array is required and cannot be empty',
            });
        }

        // Check for quizzes with results
        const quizzesWithResults = [];
        for (const quizId of quizIds) {
            const resultCount = await model.SystemQuizResult.count({
                where: { systemQuizId: quizId },
            });
            if (resultCount > 0) {
                const quiz = await model.SystemQuiz.findByPk(quizId, {
                    attributes: ['id', 'title'],
                });
                if (quiz) {
                    quizzesWithResults.push({
                        id: quiz.id,
                        title: quiz.title,
                        resultCount,
                    });
                }
            }
        }

        if (quizzesWithResults.length > 0) {
            return res.status(409).json({
                success: false,
                message:
                    'Some quizzes have student results and cannot be deleted',
                quizzesWithResults,
            });
        }

        // Delete quizzes that don't have results
        const deletedCount = await model.SystemQuiz.destroy({
            where: { id: quizIds },
        });

        res.status(200).json({
            success: true,
            message: `${deletedCount} quizzes deleted successfully`,
            deletedCount,
        });
    } catch (error) {
        console.error('Error in bulk delete quizzes:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

/**
 * Bulk category reassignment
 */
export const bulkReassignCategory = async (req, res) => {
    try {
        const model = setUpModels(req.db);
        const { quizIds, newCategoryId } = req.body;

        if (!quizIds || !Array.isArray(quizIds) || quizIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Quiz IDs array is required and cannot be empty',
            });
        }

        if (!newCategoryId) {
            return res.status(400).json({
                success: false,
                message: 'New category ID is required',
            });
        }

        // Check if category exists
        const category = await model.SystemCategory.findByPk(newCategoryId);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        // Update quizzes
        const [updatedCount] = await model.SystemQuiz.update(
            { category: newCategoryId },
            { where: { id: quizIds } }
        );

        res.status(200).json({
            success: true,
            message: `${updatedCount} quizzes reassigned to category "${category.name}"`,
            updatedCount,
            categoryName: category.name,
        });
    } catch (error) {
        console.error('Error in bulk reassign category:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

/**
 * Quiz Templates and Import/Export functionality
 */
export const getQuizTemplates = async (req, res) => {
    try {
        // Static templates for now - could be moved to database later
        const templates = [
            {
                id: 'javascript-basics',
                name: 'JavaScript Basics Template',
                description: 'Template for basic JavaScript concepts',
                category: 'JavaScript Basics',
                difficulty: 'Easy',
                time: 30,
                questions: [
                    {
                        question:
                            'What is the correct way to declare a variable in JavaScript?',
                        options: [
                            { text: 'var myVar = 5;', isCorrect: true },
                            { text: 'variable myVar = 5;', isCorrect: false },
                            { text: 'v myVar = 5;', isCorrect: false },
                            { text: 'declare myVar = 5;', isCorrect: false },
                        ],
                    },
                    {
                        question:
                            'Which of the following is NOT a JavaScript data type?',
                        options: [
                            { text: 'String', isCorrect: false },
                            { text: 'Boolean', isCorrect: false },
                            { text: 'Float', isCorrect: true },
                            { text: 'Number', isCorrect: false },
                        ],
                    },
                ],
            },
            {
                id: 'python-basics',
                name: 'Python Basics Template',
                description: 'Template for basic Python concepts',
                category: 'Python Basics',
                difficulty: 'Easy',
                time: 30,
                questions: [
                    {
                        question:
                            'What is the correct way to create a function in Python?',
                        options: [
                            { text: 'def myFunction():', isCorrect: true },
                            {
                                text: 'function myFunction():',
                                isCorrect: false,
                            },
                            { text: 'create myFunction():', isCorrect: false },
                            { text: 'func myFunction():', isCorrect: false },
                        ],
                    },
                    {
                        question:
                            'Which symbol is used for comments in Python?',
                        options: [
                            { text: '//', isCorrect: false },
                            { text: '/* */', isCorrect: false },
                            { text: '#', isCorrect: true },
                            { text: '--', isCorrect: false },
                        ],
                    },
                ],
            },
        ];

        res.status(200).json({
            success: true,
            data: templates,
        });
    } catch (error) {
        console.error('Error fetching quiz templates:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

/**
 * Export quiz data as JSON
 */
export const exportQuiz = async (req, res) => {
    try {
        const model = setUpModels(req.db);
        const { id } = req.params;

        const quiz = await model.SystemQuiz.findOne({
            where: { id },
            include: [
                {
                    model: model.SystemCategory,
                    attributes: ['name'],
                },
            ],
        });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found',
            });
        }

        const questions = await model.SystemQuestion.findAll({
            where: { systemQuizId: id },
            include: [
                {
                    model: model.SystemAnswerOption,
                    as: 'SystemAnswerOptions',
                    attributes: ['text', 'isCorrect'],
                },
            ],
            attributes: ['id', 'text'],
        });

        const exportData = {
            title: quiz.title,
            description: quiz.description,
            category: quiz.SystemCategory?.name || 'Uncategorized',
            difficulty: quiz.difficulty,
            time: quiz.time,
            questions: questions.map((q) => ({
                question: q.text,
                options: q.SystemAnswerOptions.map((o) => ({
                    text: o.text,
                    isCorrect: o.isCorrect,
                })),
            })),
            exportedAt: new Date().toISOString(),
            exportedBy: req.user.id,
        };

        res.status(200).json({
            success: true,
            data: exportData,
        });
    } catch (error) {
        console.error('Error exporting quiz:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

/**
 * Import quiz data from JSON
 */
export const importQuiz = async (req, res) => {
    try {
        const model = setUpModels(req.db);
        const { quizData } = req.body;

        if (!quizData || !quizData.title || !quizData.questions) {
            return res.status(400).json({
                success: false,
                message: 'Invalid quiz data. Title and questions are required.',
            });
        }

        // Find or create category
        let categoryId = null;
        if (quizData.category) {
            const [category] = await model.SystemCategory.findOrCreate({
                where: { name: quizData.category },
                defaults: {
                    name: quizData.category,
                    description: `Auto-created category for imported quiz: ${quizData.title}`,
                },
            });
            categoryId = category.id;
        }

        // Create quiz
        const quiz = await model.SystemQuiz.create({
            title: quizData.title,
            description: quizData.description || '',
            createdBy: req.user.id,
            category: categoryId,
            time: quizData.time || 30,
            difficulty: quizData.difficulty || 'Medium',
            questionsCount: quizData.questions.length,
        });

        // Create questions and options
        for (const q of quizData.questions) {
            const question = await model.SystemQuestion.create({
                systemQuizId: quiz.id,
                text: q.question,
            });

            for (const opt of q.options) {
                await model.SystemAnswerOption.create({
                    systemQuestionId: question.id,
                    text: opt.text,
                    isCorrect: opt.isCorrect,
                });
            }
        }

        res.status(201).json({
            success: true,
            message: 'Quiz imported successfully',
            data: { id: quiz.id, title: quiz.title },
        });
    } catch (error) {
        console.error('Error importing quiz:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

/**
 * Student Quiz Controller
 *
 * Handles quiz-related operations for students including:
 * - Fetching quiz questions and options
 * - Checking quiz attempt eligibility
 * - Submitting quiz answers and calculating scores
 * - Tracking student progress and results
 *
 * @module StudentQuizController
 * @version 2.0.0
 * @author KhodKquiz Team
 */

import setUpModels from '../../../models/index.js';

/**
 * Retrieves quiz questions with answer options for a specific quiz
 *
 * This endpoint returns all questions for a quiz along with their multiple choice options.
 * The isCorrect field is included for answer validation during submission.
 *
 * @async
 * @function getSystemQuizById
 * @param {Object} req - Express request object
 * @param {string} req.params.id - The unique identifier of the quiz
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with quiz questions and options
 *
 * @example
 * // GET /api/student/quiz/123
 * // Response:
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": 1,
 *       "question": "What is JavaScript?",
 *       "options": [
 *         { "id": 1, "text": "A programming language", "isCorrect": true },
 *         { "id": 2, "text": "A database", "isCorrect": false }
 *       ]
 *     }
 *   ]
 * }
 */
export const getSystemQuizById = async (req, res) => {
    const { id } = req.params;
    try {
        const model = setUpModels(req.db);
        const questions = await model.SystemQuestion.findAll({
            where: { systemQuizId: id },
            include: [
                {
                    model: model.SystemAnswerOption,
                    as: 'SystemAnswerOptions',
                    attributes: ['id', 'text', 'isCorrect'],
                },
            ],
            attributes: ['id', 'text'],
        });

        const formattedQuestions = questions.map((questionData) => ({
            id: questionData.id,
            question: questionData.text,
            options: questionData.SystemAnswerOptions.map((optionData) => ({
                id: optionData.id,
                text: optionData.text,
                isCorrect: optionData.isCorrect,
            })),
        }));

        res.status(200).json({ success: true, data: formattedQuestions });
    } catch (error) {
        console.error('Error in getQuizById:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

/**
 * Check quiz attempt eligibility
 * Returns attempt count and whether user can take the quiz
 */
/**
 * Checks if a student is eligible to attempt a specific quiz
 *
 * Validates attempt limits (maximum 3 attempts per quiz) and returns
 * eligibility status along with attempt information.
 *
 * @async
 * @function checkQuizEligibility
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Quiz ID to check eligibility for
 * @param {Object} req.user - Authenticated user object from middleware
 * @param {number} req.user.id - Student's user ID
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Eligibility status and attempt information
 *
 * @example
 * // GET /api/student/quiz/123/eligibility
 * // Response:
 * {
 *   "success": true,
 *   "data": {
 *     "attemptCount": 1,
 *     "remainingAttempts": 2,
 *     "canAttempt": true,
 *     "maxAttempts": 3
 *   }
 * }
 */
export const checkQuizEligibility = async (req, res) => {
    const { quizId } = req.params;
    const studentId = req.user.id;

    try {
        const model = setUpModels(req.db);

        // Check if quiz exists
        const quiz = await model.SystemQuiz.findByPk(quizId);
        if (!quiz) {
            return res
                .status(404)
                .json({ success: false, message: 'Quiz not found' });
        }

        // Count existing attempts
        const attemptCount = await model.SystemQuizResult.count({
            where: { studentId, systemQuizId: quizId },
        });

        const canAttempt = attemptCount < 3;
        const remainingAttempts = Math.max(0, 3 - attemptCount);

        res.status(200).json({
            success: true,
            data: {
                attemptCount,
                remainingAttempts,
                canAttempt,
                maxAttempts: 3,
            },
        });
    } catch (error) {
        console.error('Error checking quiz eligibility:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

/**
 * Submit quiz result and store in database with detailed answer tracking
 * Creates a new SystemQuizResult record and individual answer records
 */
export const submitQuizResult = async (req, res) => {
    const {
        quizId,
        score,
        correctAnswers,
        totalQuestions,
        timeTaken,
        answers, // Array of { questionId, selectedOptionId, isCorrect, timeTaken }
        startedAt,
    } = req.body;
    const studentId = req.user.id;

    try {
        const model = setUpModels(req.db);

        // Check if quiz exists
        const quiz = await model.SystemQuiz.findByPk(quizId);
        if (!quiz) {
            return res
                .status(404)
                .json({ success: false, message: 'Quiz not found' });
        }

        // Check attempt limit
        const attemptCount = await model.SystemQuizResult.count({
            where: { studentId, systemQuizId: quizId },
        });

        if (attemptCount >= 3) {
            return res.status(400).json({
                success: false,
                message: 'Maximum attempts (3) reached for this quiz',
            });
        }

        const nextAttemptNumber = attemptCount + 1;

        // Create quiz result record
        const result = await model.SystemQuizResult.create({
            studentId,
            systemQuizId: quizId,
            score,
            attemptNumber: nextAttemptNumber,
            totalQuestions,
            correctAnswers,
            timeTaken,
            startedAt: new Date(startedAt),
            completedAt: new Date(),
            takenAt: new Date(),
        });

        // Create individual answer records
        if (answers && answers.length > 0) {
            // Filter out invalid answers and validate required fields
            const validAnswers = answers.filter((answer) => {
                if (!answer.questionId) {
                    console.error(
                        'Invalid answer - missing questionId:',
                        answer
                    );
                    return false;
                }
                return true;
            });

            if (validAnswers.length > 0) {
                const answerRecords = validAnswers.map((answer) => ({
                    systemQuizResultId: result.id,
                    studentId,
                    systemQuestionId: answer.questionId,
                    selectedSystemAnswerOptionId:
                        answer.selectedOptionId || null,
                    isCorrect: answer.isCorrect,
                    timeTaken: answer.timeTaken,
                    answeredAt: new Date(),
                }));

                await model.SystemStudentAnswer.bulkCreate(answerRecords);
            } else {
                console.warn('No valid answers to save');
            }
        }

        res.status(201).json({
            success: true,
            message: 'Quiz result submitted successfully',
            data: {
                resultId: result.id,
                attemptNumber: nextAttemptNumber,
                score,
                correctAnswers,
                totalQuestions,
                accuracy:
                    totalQuestions > 0
                        ? Math.round((correctAnswers / totalQuestions) * 100)
                        : 0,
                timeTaken,
                remainingAttempts: Math.max(0, 3 - nextAttemptNumber),
            },
        });
    } catch (error) {
        console.error('Error submitting quiz result:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

/**
 * Get student's quiz results and progress with category-based tracking
 * Returns recent quiz attempts, overall statistics, and category progress
 */
export const getStudentProgress = async (req, res) => {
    const studentId = req.user.id;

    try {
        const model = setUpModels(req.db);

        // Define main category mappings
        const mainCategoryMappings = {
            'C Programming': [
                'C Programming I',
                'C Programming II',
                'C Programming III',
            ],
            Java: ['Java Fundamentals', 'Java OOP', 'Java Advanced'],
            JavaScript: [
                'JavaScript Basics',
                'JavaScript DOM',
                'JavaScript Async',
            ],
            SQL: ['SQL Basics', 'SQL Joins', 'SQL Advanced'],
            Python: ['Python Basics', 'Python OOP', 'Python Data Structures'],
            'Data Structures': [
                'Arrays & Strings',
                'Linked Lists',
                'Stacks & Queues',
                'Trees & Graphs',
            ],
            Algorithms: [
                'Sorting Algorithms',
                'Searching Algorithms',
                'Dynamic Programming',
            ],
            'Web Development': [
                'HTML & CSS',
                'React Fundamentals',
                'Node.js Backend',
            ],
        };

        // Get all quiz results for the student (not just recent ones for progress calculation)
        const allResults = await model.SystemQuizResult.findAll({
            where: { studentId },
            include: [
                {
                    model: model.SystemQuiz,
                    attributes: [
                        'id',
                        'title',
                        'category',
                        'difficulty',
                        'questionsCount',
                    ],
                    include: [
                        {
                            model: model.SystemCategory,
                            attributes: ['name'],
                        },
                    ],
                },
            ],
            order: [['takenAt', 'DESC']],
        });

        // Get recent results for display (limit 10)
        const recentResults = allResults.slice(0, 10);

        // Calculate category progress
        const categoryProgress = {};

        // Initialize category progress
        Object.keys(mainCategoryMappings).forEach((mainCategory) => {
            categoryProgress[mainCategory] = {
                completedQuizzes: 0,
                totalQuizzes: 0,
                progress: 0,
                subcategories: {},
            };
        });

        // Get all available quizzes to calculate total quizzes per category
        const allQuizzes = await model.SystemQuiz.findAll({
            include: [
                {
                    model: model.SystemCategory,
                    attributes: ['name'],
                },
            ],
        });

        // Count total quizzes per main category
        allQuizzes.forEach((quiz) => {
            const categoryName = quiz.SystemCategory?.name;
            if (categoryName) {
                Object.keys(mainCategoryMappings).forEach((mainCategory) => {
                    if (
                        mainCategoryMappings[mainCategory].includes(
                            categoryName
                        )
                    ) {
                        categoryProgress[mainCategory].totalQuizzes++;
                        categoryProgress[mainCategory].subcategories[
                            categoryName
                        ] = {
                            completed: false,
                            bestScore: 0,
                            bestAccuracy: 0,
                        };
                    }
                });
            }
        });

        // Track completed quizzes and best scores per quiz
        const completedQuizzes = new Map(); // quizId -> best result

        allResults.forEach((result) => {
            const quizId = result.systemQuizId;
            const categoryName = result.SystemQuiz.SystemCategory?.name;
            const accuracy =
                result.totalQuestions > 0
                    ? Math.round(
                          (result.correctAnswers / result.totalQuestions) * 100
                      )
                    : 0;

            // Track best result for each quiz
            if (
                !completedQuizzes.has(quizId) ||
                accuracy > completedQuizzes.get(quizId).accuracy
            ) {
                completedQuizzes.set(quizId, {
                    accuracy,
                    score: parseFloat(result.score),
                    categoryName,
                });
            }
        });

        // Update category progress based on completed quizzes
        completedQuizzes.forEach((bestResult) => {
            const categoryName = bestResult.categoryName;
            if (categoryName) {
                Object.keys(mainCategoryMappings).forEach((mainCategory) => {
                    if (
                        mainCategoryMappings[mainCategory].includes(
                            categoryName
                        )
                    ) {
                        categoryProgress[mainCategory].completedQuizzes++;
                        if (
                            categoryProgress[mainCategory].subcategories[
                                categoryName
                            ]
                        ) {
                            categoryProgress[mainCategory].subcategories[
                                categoryName
                            ].completed = true;
                            categoryProgress[mainCategory].subcategories[
                                categoryName
                            ].bestScore = bestResult.score;
                            categoryProgress[mainCategory].subcategories[
                                categoryName
                            ].bestAccuracy = bestResult.accuracy;
                        }
                    }
                });
            }
        });

        // Calculate progress percentages
        Object.keys(categoryProgress).forEach((mainCategory) => {
            const category = categoryProgress[mainCategory];
            category.progress =
                category.totalQuizzes > 0
                    ? Math.round(
                          (category.completedQuizzes / category.totalQuizzes) *
                              100
                      )
                    : 0;
        });

        // Calculate overall statistics
        const totalQuizzes = recentResults.length;
        const averageScore =
            totalQuizzes > 0
                ? recentResults.reduce(
                      (sum, result) => sum + parseFloat(result.score),
                      0
                  ) / totalQuizzes
                : 0;

        // Format results for frontend
        const formattedResults = recentResults.map((result) => ({
            id: result.id,
            quizId: result.systemQuizId,
            quizTitle: result.SystemQuiz.title,
            category: result.SystemQuiz.SystemCategory?.name || 'Uncategorized',
            difficulty: result.SystemQuiz.difficulty,
            score: parseFloat(result.score),
            questionsCount: result.SystemQuiz.questionsCount,
            takenAt: result.takenAt,
            accuracy:
                result.totalQuestions > 0
                    ? Math.round(
                          (result.correctAnswers / result.totalQuestions) * 100
                      )
                    : 0,
        }));

        res.status(200).json({
            success: true,
            data: {
                recentResults: formattedResults,
                categoryProgress,
                statistics: {
                    totalQuizzes,
                    averageScore: Math.round(averageScore),
                    averageAccuracy:
                        formattedResults.length > 0
                            ? Math.round(
                                  formattedResults.reduce(
                                      (sum, result) => sum + result.accuracy,
                                      0
                                  ) / formattedResults.length
                              )
                            : 0,
                },
            },
        });
    } catch (error) {
        console.error('Error fetching student progress:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

/**
 * Get organized category structure with main categories and subcategories
 * Returns hierarchical category structure with progress information
 */
export const getCategoryStructure = async (req, res) => {
    const studentId = req.user.id;

    try {
        const model = setUpModels(req.db);

        // Define main category mappings
        const mainCategoryMappings = {
            'C Programming': [
                'C Programming I',
                'C Programming II',
                'C Programming III',
            ],
            Java: ['Java Fundamentals', 'Java OOP', 'Java Advanced'],
            JavaScript: [
                'JavaScript Basics',
                'JavaScript DOM',
                'JavaScript Async',
            ],
            SQL: ['SQL Basics', 'SQL Joins', 'SQL Advanced'],
            Python: ['Python Basics', 'Python OOP', 'Python Data Structures'],
            'Data Structures': [
                'Arrays & Strings',
                'Linked Lists',
                'Stacks & Queues',
                'Trees & Graphs',
            ],
            Algorithms: [
                'Sorting Algorithms',
                'Searching Algorithms',
                'Dynamic Programming',
            ],
            'Web Development': [
                'HTML & CSS',
                'React Fundamentals',
                'Node.js Backend',
            ],
        };

        // Get all categories and quizzes
        const allCategories = await model.SystemCategory.findAll({
            include: [
                {
                    model: model.SystemQuiz,
                    attributes: [
                        'id',
                        'title',
                        'difficulty',
                        'questionsCount',
                        'time',
                    ],
                    required: false, // LEFT JOIN to include categories without quizzes
                },
            ],
        });

        // Get student's quiz results for progress calculation
        const studentResults = await model.SystemQuizResult.findAll({
            where: { studentId },
            include: [
                {
                    model: model.SystemQuiz,
                    include: [
                        {
                            model: model.SystemCategory,
                            attributes: ['name'],
                        },
                    ],
                },
            ],
        });

        // Track best results per quiz
        const bestResults = new Map();
        studentResults.forEach((result) => {
            const quizId = result.systemQuizId;
            const accuracy =
                result.totalQuestions > 0
                    ? Math.round(
                          (result.correctAnswers / result.totalQuestions) * 100
                      )
                    : 0;

            if (
                !bestResults.has(quizId) ||
                accuracy > bestResults.get(quizId).accuracy
            ) {
                bestResults.set(quizId, {
                    accuracy,
                    score: parseFloat(result.score),
                    attemptCount: studentResults.filter(
                        (r) => r.systemQuizId === quizId
                    ).length,
                });
            }
        });

        // Build organized structure
        const organizedStructure = {};

        Object.keys(mainCategoryMappings).forEach((mainCategory) => {
            organizedStructure[mainCategory] = {
                name: mainCategory,
                subcategories: [],
                totalQuizzes: 0,
                completedQuizzes: 0,
                progress: 0,
            };

            mainCategoryMappings[mainCategory].forEach((subcategoryName) => {
                const category = allCategories.find(
                    (cat) => cat.name === subcategoryName
                );
                if (category) {
                    const subcategoryData = {
                        id: category.id,
                        name: subcategoryName,
                        quizzes: (
                            category.systemQuizzes ||
                            category.SystemQuizzes ||
                            []
                        ).map((quiz) => {
                            const bestResult = bestResults.get(quiz.id);
                            return {
                                id: quiz.id,
                                title: quiz.title,
                                difficulty: quiz.difficulty,
                                questionsCount: quiz.questionsCount,
                                time: quiz.time,
                                completed: !!bestResult,
                                bestScore: bestResult?.score || 0,
                                bestAccuracy: bestResult?.accuracy || 0,
                                attemptCount: bestResult?.attemptCount || 0,
                            };
                        }),
                    };

                    organizedStructure[mainCategory].subcategories.push(
                        subcategoryData
                    );
                    organizedStructure[mainCategory].totalQuizzes +=
                        subcategoryData.quizzes.length;
                    organizedStructure[mainCategory].completedQuizzes +=
                        subcategoryData.quizzes.filter(
                            (quiz) => quiz.completed
                        ).length;
                }
            });

            // Calculate progress percentage
            organizedStructure[mainCategory].progress =
                organizedStructure[mainCategory].totalQuizzes > 0
                    ? Math.round(
                          (organizedStructure[mainCategory].completedQuizzes /
                              organizedStructure[mainCategory].totalQuizzes) *
                              100
                      )
                    : 0;
        });

        res.status(200).json({
            success: true,
            data: organizedStructure,
        });
    } catch (error) {
        console.error('Error fetching category structure:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

/**
 * Get quiz attempt history for a specific quiz
 * Returns all attempts by the student for a particular quiz
 */
export const getQuizAttemptHistory = async (req, res) => {
    const { quizId } = req.params;
    const studentId = req.user.id;

    try {
        const model = setUpModels(req.db);

        // Get all attempts for this quiz by this student
        const attempts = await model.SystemQuizResult.findAll({
            where: { studentId, systemQuizId: quizId },
            include: [
                {
                    model: model.SystemQuiz,
                    attributes: ['title', 'difficulty'],
                    include: [
                        {
                            model: model.SystemCategory,
                            attributes: ['name'],
                        },
                    ],
                },
            ],
            order: [['attemptNumber', 'ASC']],
        });

        const formattedAttempts = attempts.map((attempt) => ({
            id: attempt.id,
            attemptNumber: attempt.attemptNumber,
            score: parseFloat(attempt.score),
            correctAnswers: attempt.correctAnswers,
            totalQuestions: attempt.totalQuestions,
            accuracy:
                attempt.totalQuestions > 0
                    ? Math.round(
                          (attempt.correctAnswers / attempt.totalQuestions) *
                              100
                      )
                    : 0,
            timeTaken: attempt.timeTaken,
            startedAt: attempt.startedAt,
            completedAt: attempt.completedAt,
            takenAt: attempt.takenAt,
            quiz: {
                title: attempt.SystemQuiz.title,
                difficulty: attempt.SystemQuiz.difficulty,
                category:
                    attempt.SystemQuiz.SystemCategory?.name || 'Uncategorized',
            },
        }));

        const attemptCount = attempts.length;
        const remainingAttempts = Math.max(0, 3 - attemptCount);
        const canAttempt = attemptCount < 3;

        res.status(200).json({
            success: true,
            data: {
                attempts: formattedAttempts,
                attemptCount,
                remainingAttempts,
                canAttempt,
                maxAttempts: 3,
            },
        });
    } catch (error) {
        console.error('Error getting quiz attempt history:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

/**
 * Get attempt selection data for a quiz
 * Returns all attempts with summary info for selection interface
 */
export const getAttemptSelectionData = async (req, res) => {
    const { quizId } = req.params;
    const studentId = req.user.id;

    try {
        const model = setUpModels(req.db);

        // Get all attempts for this quiz by this student
        const attempts = await model.SystemQuizResult.findAll({
            where: { studentId, systemQuizId: quizId },
            include: [
                {
                    model: model.SystemQuiz,
                    attributes: ['title', 'difficulty', 'questionsCount'],
                    include: [
                        {
                            model: model.SystemCategory,
                            attributes: ['name'],
                        },
                    ],
                },
            ],
            order: [['attemptNumber', 'DESC']], // Most recent first
        });

        if (attempts.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No attempts found for this quiz',
            });
        }

        const formattedAttempts = attempts.map((attempt) => ({
            id: attempt.id,
            attemptNumber: attempt.attemptNumber,
            score: parseFloat(attempt.score),
            correctAnswers: attempt.correctAnswers,
            totalQuestions: attempt.totalQuestions,
            accuracy:
                attempt.totalQuestions > 0
                    ? Math.round(
                          (attempt.correctAnswers / attempt.totalQuestions) *
                              100
                      )
                    : 0,
            timeTaken: attempt.timeTaken,
            takenAt: attempt.takenAt,
            formattedDate: new Date(attempt.takenAt).toLocaleDateString(
                'en-US',
                {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }
            ),
        }));

        // Get quiz info from first attempt
        const quizInfo = {
            title: attempts[0].SystemQuiz.title,
            difficulty: attempts[0].SystemQuiz.difficulty,
            questionsCount: attempts[0].SystemQuiz.questionsCount,
            category:
                attempts[0].SystemQuiz.SystemCategory?.name || 'Uncategorized',
        };

        res.status(200).json({
            success: true,
            data: {
                quiz: quizInfo,
                attempts: formattedAttempts,
                totalAttempts: attempts.length,
                maxAttempts: 3,
            },
        });
    } catch (error) {
        console.error('Error getting attempt selection data:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

/**
 * Get detailed results for a specific quiz attempt
 * Returns question-by-question breakdown with answers
 */
export const getAttemptDetails = async (req, res) => {
    const { resultId } = req.params;
    const studentId = req.user.id;

    try {
        const model = setUpModels(req.db);

        // Get the quiz result
        const result = await model.SystemQuizResult.findOne({
            where: { id: resultId, studentId },
            include: [
                {
                    model: model.SystemQuiz,
                    attributes: ['title', 'difficulty', 'description'],
                    include: [
                        {
                            model: model.SystemCategory,
                            attributes: ['name'],
                        },
                    ],
                },
            ],
        });

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Quiz result not found',
            });
        }

        // Get detailed answers for this attempt
        const answers = await model.SystemStudentAnswer.findAll({
            where: { systemQuizResultId: resultId },
            include: [
                {
                    model: model.SystemQuestion,
                    attributes: ['text'],
                },
                {
                    model: model.SystemAnswerOption,
                    attributes: ['text', 'isCorrect'],
                },
            ],
            order: [['systemQuestionId', 'ASC']],
        });

        // Get all answer options for each question to show what the correct answer was
        const questionIds = answers.map((answer) => answer.systemQuestionId);
        const allOptions = await model.SystemAnswerOption.findAll({
            where: { systemQuestionId: questionIds },
            include: [
                {
                    model: model.SystemQuestion,
                    attributes: ['id', 'text'],
                },
            ],
            order: [
                ['systemQuestionId', 'ASC'],
                ['id', 'ASC'],
            ],
        });

        // Group options by question
        const optionsByQuestion = {};
        allOptions.forEach((option) => {
            const questionId = option.systemQuestionId;
            if (!optionsByQuestion[questionId]) {
                optionsByQuestion[questionId] = [];
            }
            optionsByQuestion[questionId].push({
                id: option.id,
                text: option.text,
                isCorrect: option.isCorrect,
            });
        });

        // Format the detailed results
        const detailedAnswers = answers.map((answer) => {
            const questionId = answer.systemQuestionId;
            const correctOption = optionsByQuestion[questionId]?.find(
                (opt) => opt.isCorrect
            );

            return {
                questionId: answer.systemQuestionId,
                questionText: answer.SystemQuestion.text,
                selectedAnswer: {
                    id: answer.selectedSystemAnswerOptionId,
                    text: answer.SystemAnswerOption.text,
                    isCorrect: answer.SystemAnswerOption.isCorrect,
                },
                correctAnswer: correctOption
                    ? {
                          id: correctOption.id,
                          text: correctOption.text,
                      }
                    : null,
                allOptions: optionsByQuestion[questionId] || [],
                isCorrect: answer.isCorrect,
                timeTaken: answer.timeTaken,
                answeredAt: answer.answeredAt,
            };
        });

        const formattedResult = {
            id: result.id,
            attemptNumber: result.attemptNumber,
            score: parseFloat(result.score),
            correctAnswers: result.correctAnswers,
            totalQuestions: result.totalQuestions,
            accuracy:
                result.totalQuestions > 0
                    ? Math.round(
                          (result.correctAnswers / result.totalQuestions) * 100
                      )
                    : 0,
            timeTaken: result.timeTaken,
            startedAt: result.startedAt,
            completedAt: result.completedAt,
            quiz: {
                title: result.SystemQuiz.title,
                difficulty: result.SystemQuiz.difficulty,
                description: result.SystemQuiz.description,
                category:
                    result.SystemQuiz.SystemCategory?.name || 'Uncategorized',
            },
            answers: detailedAnswers,
        };

        res.status(200).json({
            success: true,
            data: formattedResult,
        });
    } catch (error) {
        console.error('Error getting attempt details:', error);
        console.error('Error details:', {
            resultId,
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

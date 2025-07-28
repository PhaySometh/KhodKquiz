import setUpModels from '../../models/index.js';

/**
 * Get leaderboard data based on quiz results
 * Uses highest accuracy and score from each different quiz for ranking
 * Ensures accuracy is always ≤ 100%
 */
export const getLeaderboard = async (req, res) => {
    try {
        const model = setUpModels(req.db);

        // Get all quiz results with user and quiz information
        const results = await model.SystemQuizResult.findAll({
            include: [
                {
                    model: model.User,
                    attributes: ['id', 'name', 'picture', 'provider'],
                },
                {
                    model: model.SystemQuiz,
                    attributes: ['id', 'title'],
                },
            ],
            order: [['takenAt', 'DESC']],
        });

        // Calculate statistics for each user using best results per quiz
        const userStats = {};

        results.forEach((result) => {
            const userId = result.studentId;
            const quizId = result.systemQuizId;
            const userName = result.User.name;
            const userPicture = result.User.picture;
            const userProvider = result.User.provider;

            // Calculate accuracy for this attempt
            const accuracy =
                result.totalQuestions > 0
                    ? Math.round(
                          (result.correctAnswers / result.totalQuestions) * 100
                      )
                    : 0;

            if (!userStats[userId]) {
                userStats[userId] = {
                    id: userId,
                    username: userName,
                    picture: userPicture,
                    provider: userProvider,
                    bestResults: new Map(), // quizId -> {score, accuracy}
                    totalScore: 0,
                    totalAccuracy: 0,
                    uniqueQuizzes: 0,
                };
            }

            // Track best result for each quiz
            const currentBest = userStats[userId].bestResults.get(quizId);
            if (
                !currentBest ||
                accuracy > currentBest.accuracy ||
                (accuracy === currentBest.accuracy &&
                    parseFloat(result.score) > currentBest.score)
            ) {
                // Update best result for this quiz
                userStats[userId].bestResults.set(quizId, {
                    score: parseFloat(result.score),
                    accuracy: accuracy,
                });
            }
        });

        // Calculate final statistics using best results only
        Object.values(userStats).forEach((user) => {
            let totalScore = 0;
            let totalAccuracy = 0;
            let uniqueQuizzes = 0;

            user.bestResults.forEach((bestResult) => {
                totalScore += bestResult.score;
                totalAccuracy += bestResult.accuracy;
                uniqueQuizzes++;
            });

            user.totalScore = Math.round(totalScore);
            user.totalAccuracy =
                uniqueQuizzes > 0
                    ? Math.round(totalAccuracy / uniqueQuizzes)
                    : 0;
            user.uniqueQuizzes = uniqueQuizzes;

            // Ensure accuracy is never over 100%
            user.totalAccuracy = Math.min(user.totalAccuracy, 100);

            // Remove the bestResults map as it's no longer needed
            delete user.bestResults;
        });

        // Convert to array
        const leaderboardData = Object.values(userStats);

        // Sort by total score (highest first), then by accuracy as tiebreaker
        leaderboardData.sort((a, b) => {
            if (b.totalScore !== a.totalScore) {
                return b.totalScore - a.totalScore;
            }
            return b.totalAccuracy - a.totalAccuracy;
        });

        // Add rank
        const rankedLeaderboard = leaderboardData.map((user, index) => ({
            id: user.id,
            username: user.username,
            picture: user.picture,
            provider: user.provider,
            score: user.totalScore,
            accuracy: user.totalAccuracy,
            quizzesTaken: user.uniqueQuizzes,
            rank: index + 1,
        }));

        res.status(200).json({
            success: true,
            data: rankedLeaderboard,
        });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

/**
 * Get category-specific leaderboard
 * Returns top students for a specific quiz category
 */
export const getCategoryLeaderboard = async (req, res) => {
    const { categoryId } = req.params;

    try {
        const model = setUpModels(req.db);

        // Get quiz results for specific category
        const results = await model.SystemQuizResult.findAll({
            include: [
                {
                    model: model.User,
                    attributes: ['id', 'name', 'picture', 'provider'],
                },
                {
                    model: model.SystemQuiz,
                    where: { category: categoryId },
                    attributes: ['title', 'category'],
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

        if (results.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No results found for this category',
            });
        }

        // Calculate statistics for each user using best results per quiz
        const userStats = {};
        let categoryName = '';

        results.forEach((result) => {
            const userId = result.studentId;
            const quizId = result.systemQuizId;
            const userName = result.User.name;
            const userPicture = result.User.picture;
            const userProvider = result.User.provider;

            // Set category name from first result
            if (!categoryName) {
                categoryName =
                    result.SystemQuiz.SystemCategory?.name || 'Uncategorized';
            }

            // Calculate accuracy for this attempt
            const accuracy =
                result.totalQuestions > 0
                    ? Math.round(
                          (result.correctAnswers / result.totalQuestions) * 100
                      )
                    : 0;

            if (!userStats[userId]) {
                userStats[userId] = {
                    id: userId,
                    username: userName,
                    picture: userPicture,
                    provider: userProvider,
                    bestResults: new Map(), // quizId -> {score, accuracy}
                    totalScore: 0,
                    totalAccuracy: 0,
                    uniqueQuizzes: 0,
                    category: categoryName,
                };
            }

            // Track best result for each quiz
            const currentBest = userStats[userId].bestResults.get(quizId);
            if (
                !currentBest ||
                accuracy > currentBest.accuracy ||
                (accuracy === currentBest.accuracy &&
                    parseFloat(result.score) > currentBest.score)
            ) {
                userStats[userId].bestResults.set(quizId, {
                    score: parseFloat(result.score),
                    accuracy: accuracy,
                });
            }
        });

        // Calculate final statistics using best results only
        Object.values(userStats).forEach((user) => {
            let totalScore = 0;
            let totalAccuracy = 0;
            let uniqueQuizzes = 0;

            user.bestResults.forEach((bestResult) => {
                totalScore += bestResult.score;
                totalAccuracy += bestResult.accuracy;
                uniqueQuizzes++;
            });

            user.totalScore = Math.round(totalScore);
            user.totalAccuracy =
                uniqueQuizzes > 0
                    ? Math.round(totalAccuracy / uniqueQuizzes)
                    : 0;
            user.uniqueQuizzes = uniqueQuizzes;

            // Ensure accuracy is never over 100%
            user.totalAccuracy = Math.min(user.totalAccuracy, 100);

            // Remove the bestResults map as it's no longer needed
            delete user.bestResults;
        });

        // Convert to array
        const categoryLeaderboard = Object.values(userStats);

        // Sort by total score (highest first), then by accuracy as tiebreaker
        categoryLeaderboard.sort((a, b) => {
            if (b.totalScore !== a.totalScore) {
                return b.totalScore - a.totalScore;
            }
            return b.totalAccuracy - a.totalAccuracy;
        });

        // Add rank
        const rankedLeaderboard = categoryLeaderboard.map((user, index) => ({
            id: user.id,
            username: user.username,
            picture: user.picture,
            provider: user.provider,
            score: user.totalScore,
            accuracy: user.totalAccuracy,
            quizzesTaken: user.uniqueQuizzes,
            category: user.category,
            rank: index + 1,
        }));

        res.status(200).json({
            success: true,
            data: rankedLeaderboard,
        });
    } catch (error) {
        console.error('Error fetching category leaderboard:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

import model from '../../models/index.js';

export const createQuiz = async (req, res) => {
    const { title, description, createdBy, category, questions, time, difficulty, questionsCount } = req.body;

    try {
        const quiz = await model.SystemQuiz.create({
            title,
            description,
            createdBy,
            category,
            time,
            difficulty,
            questionsCount
        });

        for (const q of questions) {
            const question = await model.SystemQuestion.create({
                systemQuizId: quiz.id,
                text: q.question
            });

            for (const opt of q.options) {
                await model.SystemAnswerOption.create({
                    systemQuestionId: question.id,
                    text: opt.text,
                    isCorrect: opt.isCorrect
                });
            }
        }

        res.status(201).json({ success: true, message: 'Quiz created successfully' });
    } catch (error) {
        console.error('Error creating quiz:', error);
        res.status(500).json({ success: false, message: 'Internal Server error' });
    }
};

export const getQuizById = async (req, res) => {
    const { id } = req.params;
    try {
        const quiz = await model.SystemQuiz.findOne({
            where: { id },
            exclude: ['createdAt', 'updatedAt', 'createdBy', 'attempts', 'averageAccuracy', 'questionsCount']
        });
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }

        const questions = await model.SystemQuestion.findAll({
            where: { systemQuizId: id },
            include: [{
                model: model.SystemAnswerOption,
                as: 'SystemAnswerOptions',
                attributes: ['text', 'isCorrect']
            }],
            attributes: ['id', 'text']
        });

        // Questions format
        const formattedQuestions = questions.map((q) => ({
            question: q.text,
            options: q.SystemAnswerOptions.map((o) => ({
                text: o.text,
                isCorrect: o.isCorrect
            }))
        }));

        // Quiz format
        quiz.dataValues.questions = formattedQuestions;

        res.status(200).json({ success: true, data: quiz });
    } catch (error) {
        console.error('Error in getQuizById:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const updateQuiz = async (req, res) => {
    const { id } = req.params;
    const { title, description, createdBy, category, questions, time, difficulty, questionsCount } = req.body;

    try {
        const [updatedRowsCount] = await model.SystemQuiz.update(
            { title, description, createdBy, category, time, difficulty, questionsCount },
            {
                where: { id },
                returning: true,
            }
        );

        if (updatedRowsCount === 0) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }

        await model.SystemQuestion.destroy({
            where: { systemQuizId: id }
        });

        for (const q of questions) {
            const question = await model.SystemQuestion.create({
                systemQuizId: id,
                text: q.question
            });

            for (const opt of q.options) {
                await model.SystemAnswerOption.create({
                    systemQuestionId: question.id,
                    text: opt.text,
                    isCorrect: opt.isCorrect
                });
            }
        }

        res.status(200).json({ success: true, message: 'Quiz updated successfully' });
    } catch (error) {
        console.error('Error in updateQuiz:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const deleteQuiz = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedRowsCount = await model.SystemQuiz.destroy({
            where: { id }
        });

        if (deletedRowsCount === 0) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }

        res.status(200).json({ success: true, message: 'Quiz deleted successfully' });
    } catch (error) {
        console.error('Error in deleteQuiz:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const getQuizzes = async (req, res) => {
    try {
        const quizzes = await model.SystemQuiz.findAll();
        if (!quizzes) {
            return res.status(404).json({ success: false, message: 'No quizzes found' });
        }

        res.status(200).json({ success: true, data: quizzes });
    } catch(error) {
        console.error('Error in getQuizzes:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
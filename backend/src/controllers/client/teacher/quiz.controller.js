import model from '../../../models/index.js';

export const getQuizzes = async (req, res) => {
    try {
        const quizzes = await model.Quiz.findAll({
            order: ['createdAt', 'ASC']
        });
        if (!quizzes) {
            return res.status(404).json({ success: false, message: 'No quizzes found' });
        }

        res.status(200).json({ success: true, data: quizzes });
    } catch(error) {
        console.error('Error in getQuizzes:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const getQuizById = async (req, res) => {
    const { id } = req.params;
    try {
        const quiz = await model.Quiz.findOne({
            where: { id },
            exclude: ['createdAt']
        });
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }

        const questions = await model.Question.findAll({
            where: { quizId: id },
            include: [{
                model: model.AnswerOption,
                as: 'AnswerOptions',
                attributes: ['text', 'isCorrect']
            }],
            attributes: ['id', 'question']
        });

        // Questions format
        const formattedQuestions = questions.map((q) => ({
            question: q.question,
            options: q.AnswerOptions.map((o) => ({
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

export const createQuiz = async (req, res) => {
    const { title, description, category, time, createdBy, questions } = req.body;

    try {
        const quiz = await model.Quiz.create({
            title,
            description,
            category,
            time,
            createdBy
        });

        for (const q of questions) {
            const question = await model.Question.create({
                quizId: quiz.id,
                question: q.question
            });

            for (const opt of q.options) {
                await model.AnswerOption.create({
                    questionId: question.id,
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

export const updateQuiz = async (req, res) => {
    const { id } = req.params;
    const { title, description, category, time, questions } = req.body;

    try {
        const [updatedRowsCount] = await model.Quiz.update(
            { title, description, category, time },
            {
                where: { id },
                returning: true,
            }
        );

        if (updatedRowsCount === 0) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }

        await model.Question.destroy({
            where: { quizId: id }
        });

        for (const q of questions) {
            const question = await model.Question.create({
                quizId: id,
                question: q.question
            });

            for (const opt of q.options) {
                await model.AnswerOption.create({
                    questionId: question.id,
                    text: opt.text,
                    isCorrect: opt.isCorrect
                });
            }
        }

        res.status(200).json({ success: true, message: 'Quiz updated successfully' });
    } catch (error) {
        console.error('Error updating quiz:', error);
        res.status(500).json({ success: false, message: 'Internal Server error' });
    }
};

export const deleteQuiz = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedRowsCount = await model.Quiz.destroy({
            where: { id }
        });

        if (deletedRowsCount === 0) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }

        res.status(200).json({ success: true, message: 'Quiz deleted successfully' });
    } catch (error) {
        console.error('Error deleting quiz:', error);
        res.status(500).json({ success: false, message: 'Internal Server error' });
    }
};
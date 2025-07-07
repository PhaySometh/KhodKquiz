import model from '../../../models/index.js';

export const getQuizzes = async (req, res) => {
    try {
        const quizzes = await model.Quiz.findAll();
        if (!quizzes) {
            return res.status(404).json({ success: false, message: 'No quizzes found' });
        }

        res.status(200).json({ success: true, data: quizzes });
    } catch(error) {
        console.error('Error in getQuizzes:', error);
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
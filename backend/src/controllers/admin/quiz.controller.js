import model from '../../models/index.js';

export const createQuiz = async (req, res) => {
    const { title, description, createdBy, category, questions, time } = req.body;

    try {
        const quiz = await model.SystemQuiz.create({
            title,
            description,
            createdBy,
            category,
            time
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
import setUpModels from '../../../models/index.js';

export const getSystemQuizById = async (req, res) => {
    const { id } = req.params;
    try {
        const model =  setUpModels(req.db);
        const questions = await model.SystemQuestion.findAll({
            where: { systemQuizId: id },
            include: [{
                model: model.SystemAnswerOption,
                as: 'SystemAnswerOptions',
                attributes: ['text', 'isCorrect']
            }],
            attributes: ['id', 'text']
        });

        const formatted = questions.map((q) => ({
            question: q.text,
            options: q.SystemAnswerOptions.map((o) => ({
                text: o.text,
                isCorrect: o.isCorrect
            }))
        }));

        res.status(200).json({ success: true, data: formatted });
    } catch (error) {
        console.error('Error in getQuizById:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
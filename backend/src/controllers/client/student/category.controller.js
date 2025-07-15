import setUpModels from '../../../models/index.js';

export const getSystemCategories = async (req, res) => {
    try {
        const model =  setUpModels(req.db);
        const categories = await model.SystemCategory.findAll();
        if (!categories) {
            return res.status(404).json({ success: false, message: 'No categories found' });
        }

        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        console.error('Error in getSystemCategoryById:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const getQuizzesByCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const model =  setUpModels(req.db);
        const quizzes = await model.SystemQuiz.findAll({
            where: { category: id }
        });

        if (!quizzes) {
            return res.status(404).json({ success: false, message: 'No quizzes found' });
        }

        res.status(200).json({ success: true, data: quizzes });
    } catch (error) {
        console.error('Error in getQuizzesByCategory:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
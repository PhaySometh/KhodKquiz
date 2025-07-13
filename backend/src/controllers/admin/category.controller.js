import model from '../../models/index.js';

export const getSystemCategories = async (req, res) => {
    try {
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
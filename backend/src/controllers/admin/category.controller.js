import model from '../../models/index.js';

export const getSystemCategories = async (req, res) => {
    try {
        const categories = await model.SystemCategory.findAll({
            order: ['name', 'ASC']
        });
        if (!categories) {
            return res.status(404).json({ success: false, message: 'No categories found' });
        }

        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        console.error('Error in getSystemCategories:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const getSystemCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await model.SystemCategory.findOne({
            where: { id }
        });
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        res.status(200).json({ success: true, data: category });
    } catch (error) {
        console.error('Error in getSystemCategoryById:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: 'Name is required' });
        }

        const existingCategory = await model.SystemCategory.findOne({ where: { name } });
        if (existingCategory) {
            return res.status(409).json({ success: false, message: 'Category already exists' });
        }

        const newCategory = await model.SystemCategory.create({
            name,
            description
        });

        if (!newCategory) {
            return res.status(500).json({ success: false, message: 'Failed to create category' });
        }

        res.status(201).json({ success: true, message: 'Category created successfully', data: newCategory });
    } catch (error) {
        console.error('Error in createCategory:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: 'Name is required' });
        }

        const existingCategory = await model.SystemCategory.findOne({ where: { name } });
        if (existingCategory && existingCategory.id !== id) {
            return res.status(409).json({ success: false, message: 'Category already exists' });
        }

        const [updatedRowsCount] = await model.SystemCategory.update(
            { name, description },
            {
                where: { id },
                returning: true,
            }
        );

        if (updatedRowsCount === 0) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        res.status(200).json({ success: true, message: 'Category updated successfully' });
    } catch (error) {
        console.error('Error in updateCategory:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedRowsCount = await model.SystemCategory.destroy({
            where: { id }
        });

        if (deletedRowsCount === 0) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        res.status(200).json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error in deleteCategory:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
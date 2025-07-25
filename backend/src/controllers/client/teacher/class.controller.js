import setUpModels from '../../../models/index.js';

export const getClasses = async (req, res) => {
    const { id } = req.body;
    try {
        const model =  setUpModels(req.db);
        const classes = await model.Class.findAll({
            where: { teacherId: id },
            order: [['createdAt', 'ASC']]
        });
        if (!classes) {
            return res.status(404).json({ success: false, message: 'No classes found' });
        }

        res.status(200).json({ success: true, data: classes });
    } catch (error) {
        console.error('Error in getClasses:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const getClassById = async (req, res) => {
    const { id } = req.params;
    try {
        const model =  setUpModels(req.db);
        const classObj = await model.Class.findOne({
            where: { id }
        });
        if (!classObj) {
            return res.status(404).json({ success: false, message: 'Class not found' });
        }

        res.status(200).json({ success: true, data: classObj });
    } catch (error) {
        console.error('Error in getClassById:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const createClass = async (req, res) => {
    const { name, subject, description, status, teacherId } = req.body;
    try {
        const model =  setUpModels(req.db);
        const newClass = await model.Class.create({
            name,
            subject,
            description,
            status,
            teacherId: teacherId
        });

        if (!newClass) {
            return res.status(500).json({ success: false, message: 'Failed to create class' });
        }

        res.status(201).json({ success: true, message: 'Class created successfully', data: newClass });
    } catch (error) {
        console.error('Error in createClass:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const updateClass = async (req, res) => {
    const { id } = req.params;
    const { name, subject, description, status } = req.body;
    try {
        const model =  setUpModels(req.db);
        const [updatedRowsCount] = await model.Class.update(
            { name, subject, description, status },
            {
                where: { id },
                returning: true,
            }
        );

        if (updatedRowsCount === 0) {
            return res.status(404).json({ success: false, message: 'Class not found' });
        }

        res.status(200).json({ success: true, message: 'Class updated successfully' });
    } catch (error) {
        console.error('Error in updateClass:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const deleteClass = async (req, res) => {
    const { id } = req.params;
    try {
        const model =  setUpModels(req.db);
        const deletedRowsCount = await model.Class.destroy({
            where: { id }
        });

        if (deletedRowsCount === 0) {
            return res.status(404).json({ success: false, message: 'Class not found' });
        }

        res.status(200).json({ success: true, message: 'Class deleted successfully' });
    } catch (error) {
        console.error('Error in deleteClass:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
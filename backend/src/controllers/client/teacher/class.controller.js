import model from '../../../models/index.js';

export const getClasses = async (req, res) => {
    try {
        const classes = await model.Class.findAll();
        if (!classes) {
            return res.status(404).json({ success: false, message: 'No classes found' });
        }

        res.status(200).json({ success: true, data: classes });
    } catch (error) {
        console.error('Error in getClasses:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const createClass = async (req, res) => {
    const { name, subject, description, status, teacherId } = req.body;
    try {
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
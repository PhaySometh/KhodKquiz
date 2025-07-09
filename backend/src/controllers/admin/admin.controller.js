import model from '../../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const adminRegister = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password are required' });
        }

        const existingAdmin = await model.Admin.findOne({ where: { username } });
        if (existingAdmin) {
            return res.status(409).json({ success: false, message: 'Username already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = await model.Admin.create({
            username,
            hashedPassword
        });

        if (!newAdmin) {
            return res.status(500).json({ success: false, message: 'Failed to create admin' });
        }

        res.status(201).json({ success: true, message: 'Admin created successfully' });

    } catch (error) {
        console.error('Error in adminRegister:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const adminLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password are required' });
        }

        const admin = await model.Admin.findOne({ where: { username } });
        if (!admin) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.hashedPassword);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: admin.id, username: admin.username },
            process.env.JWT_ADMIN_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ success: true, message: 'Login successful', data: token });
    } catch (error) {
        console.error('Error in adminLogin:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
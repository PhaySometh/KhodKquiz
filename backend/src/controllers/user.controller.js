import model from '../models/index.js';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const getUsers = async (req, res) => {
    try {
        const users = await model.User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};

export const verifyUser = async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const googleId = payload.sub;
        const picture = payload.picture.split('=')[0];

        // Look for the user in the database
        let user = await model.User.findOne({
            where: {
                googleId: googleId,
            },
        });

        if (!user) {
            // If user does not exist, create a new user
            user = await model.User.create({
                provider: 'google',
                googleId: googleId,
                name: payload.name,
                email: payload.email,
                picture: picture,
            });
        }

        // Generate JWT token for the user
        const tokenData = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_USER_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token: tokenData });
    } catch (error) {
        res.status(401).json({ error: 'Invalid Google Token' });
        console.error('Google Token verification failed:', error);
    }
};

export const getUser = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_USER_SECRET);
        const user = await model.User.findOne({
            where: { id: decoded.id },
            attributes: ['id', 'name', 'email', 'picture'],
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

export const updateUserProfile = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_USER_SECRET);
        const { name } = req.body;

        // Validate input
        if (!name || name.trim().length === 0) {
            return res.status(400).json({ error: 'Name is required' });
        }

        if (name.trim().length > 100) {
            return res
                .status(400)
                .json({ error: 'Name must be less than 100 characters' });
        }

        // Update user
        const [updatedRowsCount] = await model.User.update(
            { name: name.trim() },
            {
                where: { id: decoded.id },
                returning: true,
            }
        );

        if (updatedRowsCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Fetch updated user
        const updatedUser = await model.User.findOne({
            where: { id: decoded.id },
            attributes: ['id', 'name', 'email', 'picture'],
        });

        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user profile:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const createQuiz = async (req, res) => {
    const { title, time, createdBy, questions } = req.body;

    try {
        const quiz = await model.Quiz.create({
            title,
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
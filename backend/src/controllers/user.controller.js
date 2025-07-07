import model from '../models/index.js';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Get all users with pagination (admin only)
 */
export const getUsers = async (req, res) => {
    try {
        // Add pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const users = await model.User.findAndCountAll({
            limit,
            offset,
            attributes: [
                'id',
                'name',
                'email',
                'picture',
                'role',
                'provider',
                'createdAt',
            ],
        });

        res.json({
            users: users.rows,
            totalPages: Math.ceil(users.count / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

/**
 * Verify Google OAuth token and login/register user
 */
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

/**
 * Register new user with email and password
 */
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (name.trim().length > 100) {
            return res
                .status(400)
                .json({ error: 'Name must be less than 100 characters' });
        }

        // Check if user already exists
        const existingUser = await model.User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = await model.User.create({
            name: name.trim(),
            email: email.toLowerCase(),
            password: hashedPassword,
            provider: 'local',
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_USER_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({ token });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
};

/**
 * Login user with email and password
 */
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate input
        if (!email || !password) {
            return res
                .status(400)
                .json({ error: 'Email and password are required' });
        }

        // Find user
        const user = await model.User.findOne({
            where: { email: email.toLowerCase() },
        });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if user has password (might be Google OAuth user)
        if (!user.password) {
            return res.status(401).json({
                error: 'This account uses Google authentication. Please sign in with Google.',
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_USER_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

/**
 * Get current user profile
 */
export const getUser = async (req, res) => {
    try {
        const user = await model.User.findOne({
            where: { id: req.user.id },
            attributes: ['id', 'name', 'email', 'picture', 'role', 'provider'],
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (req, res) => {
    try {
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
                where: { id: req.user.id },
                returning: true,
            }
        );

        if (updatedRowsCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Fetch updated user
        const updatedUser = await model.User.findOne({
            where: { id: req.user.id },
            attributes: ['id', 'name', 'email', 'picture', 'role', 'provider'],
        });

        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user profile:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
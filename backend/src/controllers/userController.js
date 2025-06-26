import db from '../models/index.js';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from "google-auth-library";
import { sql } from '../../config/db/database.js';
import dotenv from 'dotenv';

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const getUsers = async (req, res) => {
    try {
        const users = await db.User.findAll();
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
        const user = await sql `
            SELECT * FROM users WHERE google_id = ${googleId}
        `;

        let finalUser;

        if (user.length === 0) {
            // If user does not exist, create a new user
            const [newUser] = await sql `
                INSERT INTO users (provider, google_id, name, email, picture)
                VALUES ('google', ${googleId}, ${payload.name}, ${payload.email}, ${picture})
                RETURNING *;
            `;
            finalUser = newUser;
        } else {
            finalUser = user[0];
        }

        // Generate JWT token for the user
        const tokenData = jwt.sign(
            { id: finalUser.id, email: finalUser.email },
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
        const [user] = await sql `
            SELECT id, name, email, picture FROM users WHERE id = ${decoded.id}
        `;
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
};
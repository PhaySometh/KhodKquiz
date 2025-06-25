import { Sequelize } from "sequelize";
import sequelize from "../config/db/database.js";

import UserModel from "../models/user.js";
import UserProfileModel from "../models/userprofile.js";
import QuizModel from "../models/quiz.js";

// Initialize models
const User = UserModel(sequelize, Sequelize.DataTypes);
const UserProfile = UserProfileModel(sequelize, Sequelize.DataTypes);
const Quiz = QuizModel(sequelize, Sequelize.DataTypes);

// Associations
User.hasOne(UserProfile, { onDelete: 'CASCADE' });
UserProfile.belongsTo(User);

User.hasMany(Quiz, { onDelete: 'CASCADE' });
Quiz.belongsTo(User);

// Export all
const db = { sequelize, User, UserProfile, Quiz };
export default db;
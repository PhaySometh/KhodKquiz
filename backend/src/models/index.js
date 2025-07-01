import { Sequelize } from "sequelize";
import sequelize from "../config/db/database.js";
import UserModel from "./user.model.js";
import UserProfileModel from "./userprofile.model.js";
import QuizModel from "./quiz.model.js";

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
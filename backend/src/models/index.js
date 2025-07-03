import Badge from "./Badge.model.js";
import User from "./user.model.js";
import UserBadge from "./UserBadge.model.js";
import Admin from './Admin.model.js'

// FLOW EXPLANATION:
// 1. Teachers (User.role='teacher') create Class and Quiz.
// 2. Quizzes are assigned to Class via ClassQuiz.
// 3. Students (User.role='student') enroll in Class via ClassEnrollment.
// 4. Each Quiz contains Questions and each Question has 4 AnswerOptions (QCM style).
// 5. Students answer Questions → stored in StudentAnswer.
// 6. System compares selected answers with correct ones → calculates QuizResult.
// 7. Badges can be awarded to students via UserBadge.
// 8. Admins can manage the whole system via Admin table.

// A user can earn multiple badges and A badge can be earned by multiple users.
User.belongsToMany(Badge, { through: UserBadge, foreignKey: 'userId', otherKey: 'badgeId' });
Badge.belongsToMany(User, { through: UserBadge, foreignKey: 'badgeId', otherKey: 'userId' });

const model = { Badge, User, UserBadge, Admin };

export default model;
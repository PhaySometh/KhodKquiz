import Badge from "./Badge.model.js";
import User from "./User.model.js";
import UserBadge from "./UserBadge.model.js";
import Admin from './Admin.model.js'
import AnswerOption from './AnswerOption.model.js';
import Class from './Class.model.js';
import ClassEnrollment from './ClassEnrollment.model.js';
import ClassQuiz from './ClassQuiz.model.js';
import Question from './Question.model.js';
import Quiz from './Quiz.model.js';
import QuizResult from './QuizResult.model.js';
import StudentAnswer from './StudentAnswer.model.js';
import SystemAnswerOption from "./SystemAnswerOption.model.js";
import SystemQuestion from './SystemQuestion.model.js';
import SystemQuizResult from "./SystemQuizResult.model.js";
import SystemQuiz from './SystemQuiz.model.js';
import SystemCategory from './SystemCategory.model.js';

// A user can earn multiple badges and A badge can be earned by multiple users.
User.belongsToMany(Badge, { through: UserBadge, foreignKey: 'userId', otherKey: 'badgeId' });
Badge.belongsToMany(User, { through: UserBadge, foreignKey: 'badgeId', otherKey: 'userId' });

// A user can join many classes
User.hasMany(ClassEnrollment, { foreignKey: 'studentId' });
ClassEnrollment.belongsTo(User, { foreignKey: 'studentId' });

// A teacher can create many classes
User.hasMany(Class, { foreignKey: 'teacherId' });
Class.belongsTo(User, { foreignKey: 'teacherId' });

// Results for classroom quizzes
User.hasMany(QuizResult, { foreignKey: 'studentId' });
QuizResult.belongsTo(User, { foreignKey: 'studentId' });

// Results for system quizzes
User.hasMany(SystemQuizResult, { foreignKey: 'studentId' });
SystemQuizResult.belongsTo(User, { foreignKey: 'studentId' });

User.hasMany(StudentAnswer, { foreignKey: 'studentId' });
StudentAnswer.belongsTo(User, { foreignKey: 'studentId' });

// Class and ClassEnrollment
Class.hasMany(ClassEnrollment, { foreignKey: 'classId' });
ClassEnrollment.belongsTo(Class, { foreignKey: 'classId' });

Class.belongsToMany(User, { through: ClassEnrollment, foreignKey: 'classId', otherKey: 'studentId' });
User.belongsToMany(Class, { through: ClassEnrollment, foreignKey: 'studentId', otherKey: 'classId' });

// Teacher created quizzes
User.hasMany(Quiz, { foreignKey: 'createdBy' });
Quiz.belongsTo(User, { foreignKey: 'createdBy' });

Quiz.hasMany(Question, { foreignKey: 'quizId' });
Question.belongsTo(Quiz, { foreignKey: 'quizId' });

Question.hasMany(AnswerOption, { foreignKey: 'questionId' });
AnswerOption.belongsTo(Question, { foreignKey: 'questionId' });

Class.belongsToMany(Quiz, { through: ClassQuiz, foreignKey: 'classId', otherKey: 'quizId' });
Quiz.belongsToMany(Class, { through: ClassQuiz, foreignKey: 'quizId', otherKey: 'classId' });

Quiz.hasMany(QuizResult, { foreignKey: 'quizId' });
QuizResult.belongsTo(Quiz, { foreignKey: 'quizId' });

Question.hasMany(StudentAnswer, { foreignKey: 'questionId' });
StudentAnswer.belongsTo(Question, { foreignKey: 'questionId' });

AnswerOption.hasMany(StudentAnswer, { foreignKey: 'selectedOptionId' });
StudentAnswer.belongsTo(AnswerOption, { foreignKey: 'selectedOptionId' });

Admin.hasMany(SystemQuiz, { foreignKey: 'createdBy' });
SystemQuiz.belongsTo(Admin, { foreignKey: 'createdBy' });

SystemQuiz.hasMany(SystemQuestion, { foreignKey: 'systemQuizId' });
SystemQuestion.belongsTo(SystemQuiz, { foreignKey: 'systemQuizId' });

SystemQuestion.hasMany(SystemAnswerOption, { foreignKey: 'systemQuestionId' });
SystemAnswerOption.belongsTo(SystemQuestion, { foreignKey: 'systemQuestionId' });

SystemQuiz.hasMany(SystemQuizResult, { foreignKey: 'systemQuizId' });
SystemQuizResult.belongsTo(SystemQuiz, { foreignKey: 'systemQuizId' });

SystemCategory.hasMany(SystemQuiz, { foreignKey: 'category' });
SystemQuiz.belongsTo(SystemCategory, { foreignKey: 'category' });

const model = { Badge, User, UserBadge, Admin, AnswerOption, Class, ClassEnrollment, ClassQuiz,
    Question, Quiz, QuizResult, StudentAnswer, SystemAnswerOption, SystemQuestion, SystemQuizResult,
    SystemQuiz, SystemCategory
};

export default model;
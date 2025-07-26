import defineBadge from './Badge.model.js';
import defineUser from './User.model.js';
import defineUserBadge from './UserBadge.model.js';
import defineTeacherApplication from './TeacherApplication.model.js';
import defineAnswerOption from './AnswerOption.model.js';
import defineClass from './Class.model.js';
import defineClassEnrollment from './ClassEnrollment.model.js';
import defineClassQuiz from './ClassQuiz.model.js';
import defineQuestion from './Question.model.js';
import defineQuiz from './Quiz.model.js';
import defineQuizResult from './QuizResult.model.js';
import defineStudentAnswer from './StudentAnswer.model.js';
import defineSystemAnswerOption from './SystemAnswerOption.model.js';
import defineSystemQuestion from './SystemQuestion.model.js';
import defineSystemQuizResult from './SystemQuizResult.model.js';
import defineSystemQuiz from './SystemQuiz.model.js';
import defineSystemCategory from './SystemCategory.model.js';

const setUpModels = (sequelize) => {
    const Badge = defineBadge(sequelize);
    const User = defineUser(sequelize);
    const UserBadge = defineUserBadge(sequelize);
    const TeacherApplication = defineTeacherApplication(sequelize);
    const AnswerOption = defineAnswerOption(sequelize);
    const Class = defineClass(sequelize);
    const ClassEnrollment = defineClassEnrollment(sequelize);
    const ClassQuiz = defineClassQuiz(sequelize);
    const Question = defineQuestion(sequelize);
    const Quiz = defineQuiz(sequelize);
    const QuizResult = defineQuizResult(sequelize);
    const StudentAnswer = defineStudentAnswer(sequelize);
    const SystemAnswerOption = defineSystemAnswerOption(sequelize);
    const SystemQuestion = defineSystemQuestion(sequelize);
    const SystemQuizResult = defineSystemQuizResult(sequelize);
    const SystemQuiz = defineSystemQuiz(sequelize);
    const SystemCategory = defineSystemCategory(sequelize);

    // A user can earn multiple badges and A badge can be earned by multiple users.
    User.belongsToMany(Badge, {
        through: UserBadge,
        foreignKey: 'userId',
        otherKey: 'badgeId',
    });
    Badge.belongsToMany(User, {
        through: UserBadge,
        foreignKey: 'badgeId',
        otherKey: 'userId',
    });

    // A user can join many classes
    User.hasMany(ClassEnrollment, { foreignKey: 'studentId' });
    ClassEnrollment.belongsTo(User, { foreignKey: 'studentId' });
    // Class and ClassEnrollment
    Class.hasMany(ClassEnrollment, { foreignKey: 'classId' });
    ClassEnrollment.belongsTo(Class, { foreignKey: 'classId' });

    Class.belongsToMany(User, {
        through: ClassEnrollment,
        foreignKey: 'classId',
        otherKey: 'studentId',
    });
    User.belongsToMany(Class, {
        through: ClassEnrollment,
        foreignKey: 'studentId',
        otherKey: 'classId',
    });

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

    // Teacher created quizzes
    User.hasMany(Quiz, { foreignKey: 'createdBy' });
    Quiz.belongsTo(User, { foreignKey: 'createdBy' });

    Quiz.hasMany(Question, { foreignKey: 'quizId' });
    Question.belongsTo(Quiz, { foreignKey: 'quizId' });

    Question.hasMany(AnswerOption, { foreignKey: 'questionId' });
    AnswerOption.belongsTo(Question, { foreignKey: 'questionId' });

    Class.belongsToMany(Quiz, {
        through: ClassQuiz,
        foreignKey: 'classId',
        otherKey: 'quizId',
    });
    Quiz.belongsToMany(Class, {
        through: ClassQuiz,
        foreignKey: 'quizId',
        otherKey: 'classId',
    });

    Quiz.hasMany(QuizResult, { foreignKey: 'quizId' });
    QuizResult.belongsTo(Quiz, { foreignKey: 'quizId' });

    Question.hasMany(StudentAnswer, { foreignKey: 'questionId' });
    StudentAnswer.belongsTo(Question, { foreignKey: 'questionId' });

    AnswerOption.hasMany(StudentAnswer, { foreignKey: 'selectedOptionId' });
    StudentAnswer.belongsTo(AnswerOption, { foreignKey: 'selectedOptionId' });

    // System quizzes are created by admin users (using unified User model)
    User.hasMany(SystemQuiz, {
        foreignKey: 'createdBy',
        as: 'createdSystemQuizzes',
    });
    SystemQuiz.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

    SystemQuiz.hasMany(SystemQuestion, { foreignKey: 'systemQuizId' });
    SystemQuestion.belongsTo(SystemQuiz, { foreignKey: 'systemQuizId' });

    SystemQuestion.hasMany(SystemAnswerOption, {
        foreignKey: 'systemQuestionId',
    });
    SystemAnswerOption.belongsTo(SystemQuestion, {
        foreignKey: 'systemQuestionId',
    });

    SystemQuiz.hasMany(SystemQuizResult, { foreignKey: 'systemQuizId' });
    SystemQuizResult.belongsTo(SystemQuiz, { foreignKey: 'systemQuizId' });

    SystemCategory.hasMany(SystemQuiz, { foreignKey: 'category' });
    SystemQuiz.belongsTo(SystemCategory, { foreignKey: 'category' });

    // Teacher Application relationships
    User.hasMany(TeacherApplication, {
        foreignKey: 'userId',
        as: 'teacherApplications',
    });
    TeacherApplication.belongsTo(User, {
        foreignKey: 'userId',
        as: 'applicant',
    });

    User.hasMany(TeacherApplication, {
        foreignKey: 'reviewedBy',
        as: 'reviewedApplications',
    });
    TeacherApplication.belongsTo(User, {
        foreignKey: 'reviewedBy',
        as: 'reviewer',
    });

    return {
        Badge,
        User,
        UserBadge,
        TeacherApplication,
        AnswerOption,
        Class,
        ClassEnrollment,
        ClassQuiz,
        Question,
        Quiz,
        QuizResult,
        StudentAnswer,
        SystemAnswerOption,
        SystemQuestion,
        SystemQuizResult,
        SystemQuiz,
        SystemCategory,
    };
};

export default setUpModels;

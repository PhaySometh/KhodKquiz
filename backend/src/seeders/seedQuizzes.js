import setUpModels from '../models/index.js';
import createSequelizeInstance from '../config/db/sequelize.js';

const seedQuizzes = async () => {
    try {
        const sequelize = createSequelizeInstance();
        const model = setUpModels(sequelize);

        const quizzesData = [
            {
                title: 'Math Basics',
                time: 20,
                description: 'A basic quiz on arithmetic and logic.',
                difficulty: 'Easy',
                category: 1,
                createdBy: 1,
                questions: [
                    {
                        question: 'What is 10 / 2?',
                        type: 'multiple-choice',
                        options: [
                            { text: '2', isCorrect: false },
                            { text: '5', isCorrect: true },
                            { text: '10', isCorrect: false },
                            { text: '20', isCorrect: false },
                        ],
                    },
                    {
                        question: 'Is 7 a prime number?',
                        type: 'true-false',
                        options: [
                            { text: 'True', isCorrect: true },
                            { text: 'False', isCorrect: false },
                        ],
                    },
                    {
                        question: 'What is the square root of 16?',
                        type: 'multiple-choice',
                        options: [
                            { text: '4', isCorrect: true },
                            { text: '8', isCorrect: false },
                            { text: '16', isCorrect: false },
                            { text: '2', isCorrect: false },
                        ],
                    },
                    {
                        question: 'What is 5 * 3?',
                        type: 'multiple-choice',
                        options: [
                            { text: '15', isCorrect: true },
                            { text: '10', isCorrect: false },
                            { text: '20', isCorrect: false },
                            { text: '25', isCorrect: false },
                        ],
                    },
                    {
                        question: 'What is 10 - 3?',
                        type: 'multiple-choice',
                        options: [
                            { text: '7', isCorrect: true },
                            { text: '3', isCorrect: false },
                            { text: '10', isCorrect: false },
                            { text: '13', isCorrect: false },
                        ],
                    },
                    {
                        question: 'What is 10 + 3?',
                        type: 'multiple-choice',
                        options: [
                            { text: '13', isCorrect: true },
                            { text: '7', isCorrect: false },
                            { text: '10', isCorrect: false },
                            { text: '3', isCorrect: false },
                        ],
                    },
                    {
                        question: 'What is 10 * 3?',
                        type: 'multiple-choice',
                        options: [
                            { text: '30', isCorrect: true },
                            { text: '10', isCorrect: false },
                            { text: '20', isCorrect: false },
                            { text: '13', isCorrect: false },
                        ],
                    },
                    {
                        question: 'What is 10 / 3?',
                        type: 'multiple-choice',
                        options: [
                            { text: '3.33', isCorrect: true },
                            { text: '10', isCorrect: false },
                            { text: '20', isCorrect: false },
                            { text: '13', isCorrect: false },
                        ],
                    },
                ],
            },
            {
                title: 'Geography Fun',
                time: 15,
                description: 'Test your knowledge of countries and capitals.',
                difficulty: 'Easy',
                category: 2,
                createdBy: 1,
                questions: [
                    {
                        question:
                            'Which country is known as the Land of the Rising Sun?',
                        type: 'multiple-choice',
                        options: [
                            { text: 'China', isCorrect: false },
                            { text: 'South Korea', isCorrect: false },
                            { text: 'Japan', isCorrect: true },
                            { text: 'Thailand', isCorrect: false },
                        ],
                    },
                    {
                        question:
                            'Is Canada located in the Southern Hemisphere?',
                        type: 'true-false',
                        options: [
                            { text: 'True', isCorrect: false },
                            { text: 'False', isCorrect: true },
                        ],
                    },
                    {
                        question: 'What is the capital of Australia?',
                        type: 'multiple-choice',
                        options: [
                            { text: 'Sydney', isCorrect: false },
                            { text: 'Melbourne', isCorrect: false },
                            { text: 'Canberra', isCorrect: true },
                            { text: 'Brisbane', isCorrect: false },
                        ],
                    },
                    {
                        question: 'What is the capital of France?',
                        type: 'multiple-choice',
                        options: [
                            { text: 'Paris', isCorrect: true },
                            { text: 'London', isCorrect: false },
                            { text: 'Berlin', isCorrect: false },
                            { text: 'Madrid', isCorrect: false },
                        ],
                    },
                    {
                        question: 'What is the capital of Germany?',
                        type: 'multiple-choice',
                        options: [
                            { text: 'Paris', isCorrect: false },
                            { text: 'London', isCorrect: false },
                            { text: 'Berlin', isCorrect: true },
                            { text: 'Madrid', isCorrect: false },
                        ],
                    },
                ],
            },
            {
                title: 'Science Trivia',
                time: 25,
                description: 'General science questions for high school level.',
                difficulty: 'Easy',
                category: 2,
                createdBy: 1,
                questions: [
                    {
                        question: 'What gas do plants absorb?',
                        type: 'multiple-choice',
                        options: [
                            { text: 'Oxygen', isCorrect: false },
                            { text: 'Carbon Dioxide', isCorrect: true },
                            { text: 'Nitrogen', isCorrect: false },
                            { text: 'Hydrogen', isCorrect: false },
                        ],
                    },
                    {
                        question: 'Water boils at 100°C at sea level.',
                        type: 'true-false',
                        options: [
                            { text: 'True', isCorrect: true },
                            { text: 'False', isCorrect: false },
                        ],
                    },
                    {
                        question: 'Which planet is known as the Red Planet?',
                        type: 'multiple-choice',
                        options: [
                            { text: 'Earth', isCorrect: false },
                            { text: 'Mars', isCorrect: true },
                            { text: 'Jupiter', isCorrect: false },
                            { text: 'Venus', isCorrect: false },
                        ],
                    },
                    {
                        question: 'Light travels faster than sound.',
                        type: 'true-false',
                        options: [
                            { text: 'True', isCorrect: true },
                            { text: 'False', isCorrect: false },
                        ],
                    },
                    {
                        question:
                            'Which part of the plant conducts photosynthesis?',
                        type: 'multiple-choice',
                        options: [
                            { text: 'Roots', isCorrect: false },
                            { text: 'Stem', isCorrect: false },
                            { text: 'Leaves', isCorrect: true },
                            { text: 'Flowers', isCorrect: false },
                        ],
                    },
                    {
                        question: 'Humans have four lungs.',
                        type: 'true-false',
                        options: [
                            { text: 'True', isCorrect: false },
                            { text: 'False', isCorrect: true },
                        ],
                    },
                    {
                        question: 'What is the chemical symbol for water?',
                        type: 'multiple-choice',
                        options: [
                            { text: 'H2O', isCorrect: true },
                            { text: 'O2', isCorrect: false },
                            { text: 'CO2', isCorrect: false },
                            { text: 'HO', isCorrect: false },
                        ],
                    },
                ],
            },
            {
                title: 'General Knowledge',
                time: 25,
                description: 'A quiz on general knowledge and trivia.',
                difficulty: 'Easy',
                category: 2,
                createdBy: 1,
                questions: [
                    {
                        question: 'What gas do plants absorb?',
                        type: 'multiple-choice',
                        options: [
                            { text: 'Oxygen', isCorrect: false },
                            { text: 'Carbon Dioxide', isCorrect: true },
                            { text: 'Nitrogen', isCorrect: false },
                            { text: 'Hydrogen', isCorrect: false },
                        ],
                    },
                    {
                        question: 'Water boils at 100°C at sea level.',
                        type: 'true-false',
                        options: [
                            { text: 'True', isCorrect: true },
                            { text: 'False', isCorrect: false },
                        ],
                    },
                    {
                        question:
                            'What is the largest organ in the human body?',
                        type: 'multiple-choice',
                        options: [
                            { text: 'Heart', isCorrect: false },
                            { text: 'Liver', isCorrect: false },
                            { text: 'Skin', isCorrect: true },
                            { text: 'Brain', isCorrect: false },
                        ],
                    },
                    {
                        question: 'What is the capital of Australia?',
                        type: 'multiple-choice',
                        options: [
                            { text: 'Sydney', isCorrect: false },
                            { text: 'Melbourne', isCorrect: false },
                            { text: 'Canberra', isCorrect: true },
                            { text: 'Brisbane', isCorrect: false },
                        ],
                    },
                    {
                        question: 'What is the currency of Japan?',
                        type: 'multiple-choice',
                        options: [
                            { text: 'Yen', isCorrect: true },
                            { text: 'Dollar', isCorrect: false },
                            { text: 'Euro', isCorrect: false },
                            { text: 'Pound', isCorrect: false },
                        ],
                    },
                    {
                        question: 'What is the tallest mountain in the world?',
                        type: 'multiple-choice',
                        options: [
                            { text: 'Mount Everest', isCorrect: true },
                            { text: 'K2', isCorrect: false },
                            { text: 'Kangchenjunga', isCorrect: false },
                            { text: 'Makalu', isCorrect: false },
                        ],
                    },
                    {
                        question: 'What is the largest ocean in the world?',
                        type: 'multiple-choice',
                        options: [
                            { text: 'Pacific Ocean', isCorrect: true },
                            { text: 'Atlantic Ocean', isCorrect: false },
                            { text: 'Indian Ocean', isCorrect: false },
                            { text: 'Arctic Ocean', isCorrect: false },
                        ],
                    },
                ],
            },
            {
                title: 'History Quiz',
                time: 25,
                description: 'A quiz on history and culture.',
                difficulty: 'Easy',
                category: 1,
                createdBy: 1,
                questions: [
                    {
                        question:
                            'Who was the first President of the United States?',
                        type: 'multiple-choice',
                        options: [
                            { text: 'George Washington', isCorrect: true },
                            { text: 'John Adams', isCorrect: false },
                            { text: 'Thomas Jefferson', isCorrect: false },
                            { text: 'Abraham Lincoln', isCorrect: false },
                        ],
                    },
                    {
                        question: 'What year did World War II end?',
                        type: 'multiple-choice',
                        options: [
                            { text: '1945', isCorrect: true },
                            { text: '1939', isCorrect: false },
                            { text: '1942', isCorrect: false },
                            { text: '1950', isCorrect: false },
                        ],
                    },
                    {
                        question: 'Who painted the Mona Lisa?',
                        type: 'multiple-choice',
                        options: [
                            { text: 'Leonardo da Vinci', isCorrect: true },
                            { text: 'Pablo Picasso', isCorrect: false },
                            { text: 'Vincent van Gogh', isCorrect: false },
                            { text: 'Michelangelo', isCorrect: false },
                        ],
                    },
                    {
                        question: 'Who wrote the play Romeo and Juliet?',
                        type: 'multiple-choice',
                        options: [
                            { text: 'William Shakespeare', isCorrect: true },
                            { text: 'Charles Dickens', isCorrect: false },
                            { text: 'Jane Austen', isCorrect: false },
                            { text: 'Mark Twain', isCorrect: false },
                        ],
                    },
                    {
                        question:
                            'What ancient civilization built the pyramids?',
                        type: 'multiple-choice',
                        options: [
                            { text: 'Ancient Egypt', isCorrect: true },
                            { text: 'Ancient Rome', isCorrect: false },
                            { text: 'Mesopotamia', isCorrect: false },
                            { text: 'Ancient Greece', isCorrect: false },
                        ],
                    },
                    {
                        question:
                            'Which war was fought between the North and South regions of the United States?',
                        type: 'multiple-choice',
                        options: [
                            { text: 'The American Civil War', isCorrect: true },
                            { text: 'World War I', isCorrect: false },
                            { text: 'Revolutionary War', isCorrect: false },
                            { text: 'The War of 1812', isCorrect: false },
                        ],
                    },
                    {
                        question:
                            'In which city is the famous Colosseum located?',
                        type: 'multiple-choice',
                        options: [
                            { text: 'Rome', isCorrect: true },
                            { text: 'Athens', isCorrect: false },
                            { text: 'Paris', isCorrect: false },
                            { text: 'Cairo', isCorrect: false },
                        ],
                    },
                    {
                        question: "Who was known as the 'Father of Computers'?",
                        type: 'multiple-choice',
                        options: [
                            { text: 'Charles Babbage', isCorrect: true },
                            { text: 'Alan Turing', isCorrect: false },
                            { text: 'Isaac Newton', isCorrect: false },
                            { text: 'Albert Einstein', isCorrect: false },
                        ],
                    },
                    {
                        question:
                            'What is the name of the ship that sank in 1912 after hitting an iceberg?',
                        type: 'multiple-choice',
                        options: [
                            { text: 'Titanic', isCorrect: true },
                            { text: 'Olympic', isCorrect: false },
                            { text: 'Britannic', isCorrect: false },
                            { text: 'Endeavour', isCorrect: false },
                        ],
                    },
                    {
                        question: 'Who discovered penicillin?',
                        type: 'multiple-choice',
                        options: [
                            { text: 'Alexander Fleming', isCorrect: true },
                            { text: 'Louis Pasteur', isCorrect: false },
                            { text: 'Marie Curie', isCorrect: false },
                            { text: 'Gregor Mendel', isCorrect: false },
                        ],
                    },
                ],
            },
        ];

        for (const quizData of quizzesData) {
            const quiz = await model.SystemQuiz.create({
                title: quizData.title,
                time: quizData.time,
                difficulty: quizData.difficulty,
                questionsCount: quizData.questions.length,
                description: quizData.description,
                category: quizData.category,
                createdBy: quizData.createdBy,
            });

            for (const questionData of quizData.questions) {
                const question = await model.SystemQuestion.create({
                    systemQuizId: quiz.id,
                    text: questionData.question,
                    type: questionData.type,
                });

                const options = questionData.options.map((option) => ({
                    systemQuestionId: question.id,
                    text: option.text,
                    isCorrect: option.isCorrect,
                }));

                await model.SystemAnswerOption.bulkCreate(options);
            }
        }

        console.log('✅ Quizzes seeded successfully!');
    } catch (err) {
        console.error('❌ Failed to seed quizzes:', err);
    }
};

export default seedQuizzes;

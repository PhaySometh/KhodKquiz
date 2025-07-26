import setUpModels from '../models/index.js';
import createSequelizeInstance from '../config/db/sequelize.js';

const seedCategories = async () => {
    try {
        const sequelize = createSequelizeInstance();
        const model = setUpModels(sequelize);

        const categoriesData = [
            {
                name: 'Math',
                description: 'A basic quiz on arithmetic and logic.',
            },
            {
                name: 'Science',
                description: 'A basic quiz on science and nature.',
            },
            {
                name: 'History',
                description: 'A basic quiz on history and culture.',
            },
            {
                name: 'Geography',
                description: 'A basic quiz on geography and places.',
            },
            {
                name: 'General Knowledge',
                description: 'A basic quiz on general knowledge and trivia.',
            },
        ];

        for (const categoryData of categoriesData) {
            await model.SystemCategory.create({
                name: categoryData.name,
                description: categoryData.description,
            });
        }

        console.log('✅ Categories seeded successfully!');
    } catch (err) {
        console.error('❌ Failed to seed categories:', err);
    }
};

export default seedCategories;

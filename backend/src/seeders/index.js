import seedCategories from './seedCategories.js';
import seedQuizzes from './seedQuizzes.js';
import seedAdmins from './seedAdmins.js';

import sequelize from '../config/db/sequelize.js';

async function seed() {
    try {
        await sequelize.sync({ force: true });
        
        await seedCategories();
        await seedQuizzes();
        await seedAdmins();
        
        console.log('✅ Seeding completed!');
    } catch (error) {
        console.error('Error in seeding:', error);
    }
};

seed();
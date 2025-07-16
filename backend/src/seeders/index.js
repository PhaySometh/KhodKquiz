import seedCategories from './seedCategories.js';
import seedQuizzes from './seedQuizzes.js';
import seedAdmins from './seedAdmins.js';
import seedOneMilUsers from './seedOneMilUsers.js';

import createSequelizeInstance from '../config/db/sequelize.js';
import setUpModels from '../models/index.js';

async function seed() {
    try {
        const sequelize = createSequelizeInstance('admin');
        setUpModels(sequelize);

        await sequelize.sync({ force: true });

        console.log('✅ Database synchronized!');
        
        await seedAdmins();
        await seedCategories();
        await seedQuizzes();
        await seedOneMilUsers();
        console.log('✅ Seeding completed!');
    } catch (error) {
        console.error('Error in seeding:', error);
    }
};

seed();
import seedCategories from './seedCategories.js';
import seedQuizzes from './seedQuizzes.js';
import seedAdminUser from './seedAdminUser.js';
import seedOneMilUsers from './seedOneMilUsers.js';

import createSequelizeInstance from '../config/db/sequelize.js';
import setUpModels from '../models/index.js';

async function seed() {
    try {
        const sequelize = createSequelizeInstance();
        setUpModels(sequelize);

        await sequelize.sync({ force: true });

        console.log('✅ Database synchronized!');

        await seedAdminUser();
        await seedCategories();
        await seedQuizzes();
        // await seedOneMilUsers();
        console.log('✅ Seeding completed!');

        await sequelize.close();
    } catch (error) {
        console.error('Error in seeding:', error);
    }
}

seed();

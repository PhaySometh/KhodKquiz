import seedUsers from './seedUsers.js';
import seedCategories from './seedCategories.js';
import seedQuizzes from './seedQuizzes.js';
import seedAdmins from './seedAdmins.js';

async function seed() {
    try {
        await seedUsers();
        await seedCategories();
        await seedQuizzes();
        await seedAdmins();
        
        console.log('✅ Seeding completed!');
    } catch (error) {
        console.error('Error in seeding:', error);
    }
};

seed();
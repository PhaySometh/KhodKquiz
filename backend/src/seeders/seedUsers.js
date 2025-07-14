import { faker } from '@faker-js/faker';
import model from '../models/index.js';

const seedUsers = async () => {
    try {
        const batchSize = 1000;
        const totalUsers = 1000000;

        for (let i = 0; i < totalUsers; i += batchSize) {
            const usersBatch = [];

            for (let j = 0; j < batchSize; j++) {
                usersBatch.push({
                    name: faker.person.fullName(),
                    email: faker.internet.email(),
                    password: '1234',
                    provider: 'local'
                });
            }

            await model.User.bulkCreate(usersBatch, {
                ignoreDuplicates: true // Skip duplicates like email
            });

            console.log(`Inserted batch ${i + batchSize} of ${totalUsers}`);
        }

        console.log('✅ Users seeded successfully!');
    } catch (error) {
        console.error('❌ Failed to seed users:', error);
    }
};

export default seedUsers;
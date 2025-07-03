import { faker } from '@faker-js/faker';
import model from '../models/index.js';

async function seed() {
    try {
        const batchSize = 1000;
        const totalUsers = 49000;

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

        console.log('Seeding completed!');
    } catch (error) {
        console.error('Error in seed:', error);
    }
};

seed();

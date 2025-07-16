import { faker } from '@faker-js/faker';
import setUpModels from "../models/index.js";
import createSequelizeInstance from "../config/db/sequelize.js";

const seedOneMilUsers = async () => {
    try {
        const sequelize = createSequelizeInstance('admin');
        const model =  setUpModels(sequelize);
        
        const batchSize = 1000;
        const totalUsers = 1800000;

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

export default seedOneMilUsers;
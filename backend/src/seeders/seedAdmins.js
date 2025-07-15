import setUpModels from "../models/index.js";
import createSequelizeInstance from "../config/db/sequelize.js";

const seedAdmins = async () => {
    try {
        const sequelize = createSequelizeInstance('admin');
        const model =  setUpModels(sequelize);
        const adminsData = [
            {
                username: "admin",
                password: "admin"
            },
            {
                username: "admin2",
                password: "admin2"
            },
            {
                username: "admin3",
                password: "admin3"
            }
        ];

        for (const adminData of adminsData) {
            await model.Admin.create({
                username: adminData.username,
                hashedPassword: adminData.password
            });
        }

        console.log('✅ Admins seeded successfully!');
    } catch (err) {
        console.error('❌ Failed to seed admins:', err);
    }
};

export default seedAdmins;
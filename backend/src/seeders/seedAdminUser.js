/**
 * Admin User Seeder
 *
 * Creates a default admin user for testing the RBAC system.
 * This should be run after the database is set up.
 *
 * @version 1.0.0
 * @author KhodKquiz Team
 */

import bcrypt from 'bcrypt';
import createSequelizeInstance from '../config/db/sequelize.js';
import setUpModels from '../models/index.js';

/**
 * Seed admin user
 */
async function seedAdminUser() {
    try {
        const sequelize = createSequelizeInstance();
        const model = setUpModels(sequelize);

        // Check if admin user already exists
        const existingAdmin = await model.User.findOne({
            where: {
                email: 'admin@khodkquiz.com',
                role: 'admin',
            },
        });

        if (existingAdmin) {
            console.log('✅ Admin user already exists');
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        // Create admin user
        const adminUser = await model.User.create({
            name: 'System Administrator',
            email: 'admin@khodkquiz.com',
            password: hashedPassword,
            role: 'admin',
            provider: 'local',
        });

        console.log('✅ Admin user created successfully');
        console.log('📧 Email: admin@khodkquiz.com');
        console.log('🔑 Password: admin123');
        console.log('⚠️  Please change the password after first login');
    } catch (error) {
        console.error('❌ Error seeding admin user:', error);
    }
}

// Run seeder if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    seedAdminUser().then(() => {
        process.exit(0);
    });
}

export default seedAdminUser;

/**
 * Category Seeding Utility
 * 
 * Seeds the database with default categories for testing and development.
 * Run this script to ensure categories exist for dropdown functionality.
 * 
 * Usage: node backend/src/utils/seedCategories.js
 * 
 * @version 2.0.0
 * @author KhodKquiz Team
 */

import setUpModels from '../models/index.js';
import sequelize from '../config/db/sequelize.js';

/**
 * Default categories to seed
 */
const defaultCategories = [
    {
        name: 'JavaScript',
        description: 'JavaScript programming language fundamentals, ES6+, and modern development practices'
    },
    {
        name: 'React',
        description: 'React.js library for building user interfaces, hooks, components, and state management'
    },
    {
        name: 'Node.js',
        description: 'Server-side JavaScript runtime, Express.js, and backend development'
    },
    {
        name: 'Python',
        description: 'Python programming language, data structures, algorithms, and web development'
    },
    {
        name: 'Java',
        description: 'Java programming language, object-oriented programming, and enterprise development'
    },
    {
        name: 'C Programming',
        description: 'C programming language fundamentals, memory management, and system programming'
    },
    {
        name: 'Database',
        description: 'SQL, NoSQL databases, database design, and data management concepts'
    },
    {
        name: 'Web Development',
        description: 'HTML, CSS, responsive design, and modern web development practices'
    },
    {
        name: 'Data Structures',
        description: 'Arrays, linked lists, trees, graphs, and algorithm complexity analysis'
    },
    {
        name: 'Software Engineering',
        description: 'Software design patterns, testing, version control, and development methodologies'
    }
];

/**
 * Seeds categories into the database
 */
async function seedCategories() {
    try {
        console.log('🌱 Starting category seeding...');
        
        // Initialize database connection
        await sequelize.authenticate();
        console.log('✅ Database connection established');
        
        // Set up models
        const model = setUpModels(sequelize);
        
        // Check existing categories
        const existingCategories = await model.SystemCategory.findAll();
        console.log(`📊 Found ${existingCategories.length} existing categories`);
        
        if (existingCategories.length > 0) {
            console.log('📋 Existing categories:');
            existingCategories.forEach(cat => {
                console.log(`   - ${cat.name}`);
            });
        }
        
        // Seed new categories
        let seededCount = 0;
        
        for (const categoryData of defaultCategories) {
            try {
                // Check if category already exists (case-insensitive)
                const existing = await model.SystemCategory.findOne({
                    where: sequelize.where(
                        sequelize.fn('LOWER', sequelize.col('name')),
                        sequelize.fn('LOWER', categoryData.name)
                    )
                });
                
                if (existing) {
                    console.log(`⏭️  Skipping "${categoryData.name}" - already exists`);
                    continue;
                }
                
                // Create new category
                await model.SystemCategory.create(categoryData);
                console.log(`✅ Created category: "${categoryData.name}"`);
                seededCount++;
                
            } catch (error) {
                console.error(`❌ Error creating category "${categoryData.name}":`, error.message);
            }
        }
        
        // Final summary
        const totalCategories = await model.SystemCategory.count();
        console.log('\n🎉 Category seeding completed!');
        console.log(`📈 Categories created: ${seededCount}`);
        console.log(`📊 Total categories in database: ${totalCategories}`);
        
        if (totalCategories === 0) {
            console.log('\n⚠️  WARNING: No categories in database!');
            console.log('   Category dropdowns will be empty until categories are created.');
        } else {
            console.log('\n✅ Category dropdowns should now work properly!');
        }
        
    } catch (error) {
        console.error('💥 Error during category seeding:', error);
        throw error;
    } finally {
        await sequelize.close();
        console.log('🔌 Database connection closed');
    }
}

/**
 * Verifies category API endpoints
 */
async function testCategoryEndpoints() {
    try {
        console.log('\n🧪 Testing category API endpoints...');
        
        const model = setUpModels(sequelize);
        
        // Test database query directly
        const categories = await model.SystemCategory.findAll({
            order: [['name', 'ASC']]
        });
        
        console.log(`✅ Database query successful: ${categories.length} categories found`);
        
        if (categories.length > 0) {
            console.log('📋 Categories in database:');
            categories.forEach((cat, index) => {
                console.log(`   ${index + 1}. ${cat.name} (ID: ${cat.id})`);
            });
        }
        
        return categories;
        
    } catch (error) {
        console.error('❌ Database query failed:', error);
        throw error;
    }
}

/**
 * Main execution function
 */
async function main() {
    try {
        console.log('🚀 KhodKquiz Category Seeding Utility');
        console.log('=====================================\n');
        
        // Test database connection first
        await testCategoryEndpoints();
        
        // Seed categories
        await seedCategories();
        
        console.log('\n✅ All operations completed successfully!');
        console.log('\n💡 Next steps:');
        console.log('   1. Start your backend server');
        console.log('   2. Test category dropdowns in quiz creation forms');
        console.log('   3. Create additional categories via admin panel if needed');
        
    } catch (error) {
        console.error('\n💥 Script failed:', error.message);
        process.exit(1);
    }
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { seedCategories, testCategoryEndpoints, defaultCategories };

// backend/scripts/seed-menu-railway.js
// This version uses Railway's internal database URL
require('dotenv').config();
const mysql = require('mysql2/promise');

const menuItems = [
    {
        id: 1, category_id: 1, name: "Spring Roll",
        description: "Crispy spring rolls with sweet dipping sauce",
        price: 50.00,
        image: "https://via.placeholder.com/300x200?text=Spring+Rolls",
        servings: 1, preparation_time: 1,
        is_vegetarian: 0, is_vegan: 0, is_gluten_free: 0,
        rating: 0.0, total_ratings: 0, is_available: 1,
        created_at: "2025-11-26 15:25:43", updated_at: "2025-12-01 12:02:10"
    },
    {
        id: 2, category_id: 1, name: "Bruschetta",
        description: "Toasted bread with tomato and basil",
        price: 280.00,
        image: "https://via.placeholder.com/300x200?text=Bruschetta",
        servings: 1, preparation_time: 1,
        is_vegetarian: 0, is_vegan: 0, is_gluten_free: 0,
        rating: 0.0, total_ratings: 0, is_available: 1,
        created_at: "2025-11-26 15:25:43", updated_at: "2025-12-03 12:12:44"
    },
    {
        id: 3, category_id: 1, name: "Chicken Wings",
        description: "Spicy buffalo wings with ranch dip",
        price: 350.00,
        image: "https://via.placeholder.com/300x200?text=Chicken+Wings",
        servings: 0, preparation_time: 0,
        is_vegetarian: 0, is_vegan: 0, is_gluten_free: 0,
        rating: 0.0, total_ratings: 0, is_available: 1,
        created_at: "2025-11-26 15:25:43", updated_at: "2025-12-03 12:12:44"
    },
    {
        id: 4, category_id: 1, name: "Shrimp Appetizer",
        description: "Garlic shrimp skewers",
        price: 450.00,
        image: "https://via.placeholder.com/300x200?text=Shrimp+Appetizer",
        servings: 0, preparation_time: 0,
        is_vegetarian: 0, is_vegan: 0, is_gluten_free: 0,
        rating: 0.0, total_ratings: 0, is_available: 1,
        created_at: "2025-11-26 15:25:43", updated_at: "2025-12-03 12:12:44"
    },
    {
        id: 5, category_id: 2, name: "Grilled Salmon",
        description: "Fresh salmon fillet with lemon butter",
        price: 1450.00,
        image: "https://via.placeholder.com/300x200?text=Grilled+Salmon",
        servings: 0, preparation_time: 0,
        is_vegetarian: 0, is_vegan: 0, is_gluten_free: 0,
        rating: 0.0, total_ratings: 0, is_available: 1,
        created_at: "2025-11-26 15:25:43", updated_at: "2025-12-03 12:12:44"
    },
    {
        id: 6, category_id: 2, name: "Ribeye Steak",
        description: "Prime cut steak with herb butter",
        price: 1800.00,
        image: "https://via.placeholder.com/300x200?text=Ribeye+Steak",
        servings: 0, preparation_time: 0,
        is_vegetarian: 0, is_vegan: 0, is_gluten_free: 0,
        rating: 0.0, total_ratings: 0, is_available: 1,
        created_at: "2025-11-26 15:25:43", updated_at: "2025-12-03 12:12:44"
    },
    {
        id: 7, category_id: 2, name: "Chicken Parmesan",
        description: "Breaded chicken with marinara and cheese",
        price: 650.00,
        image: "https://via.placeholder.com/300x200?text=Chicken+Parmesan",
        servings: 0, preparation_time: 0,
        is_vegetarian: 0, is_vegan: 0, is_gluten_free: 0,
        rating: 0.0, total_ratings: 0, is_available: 1,
        created_at: "2025-11-26 15:25:43", updated_at: "2025-12-03 12:12:44"
    },
    {
        id: 8, category_id: 2, name: "Vegetable Stir Fry",
        description: "Mixed vegetables with rice",
        price: 450.00,
        image: "https://via.placeholder.com/300x200?text=Vegetable+Stir+Fry",
        servings: 1, preparation_time: 1,
        is_vegetarian: 0, is_vegan: 0, is_gluten_free: 0,
        rating: 0.0, total_ratings: 0, is_available: 1,
        created_at: "2025-11-26 15:25:43", updated_at: "2025-12-03 12:12:44"
    },
    {
        id: 9, category_id: 3, name: "Chocolate Cake",
        description: "Rich chocolate layer cake",
        price: 250.00,
        image: "https://via.placeholder.com/300x200?text=Chocolate+Cake",
        servings: 1, preparation_time: 0,
        is_vegetarian: 0, is_vegan: 0, is_gluten_free: 0,
        rating: 0.0, total_ratings: 0, is_available: 1,
        created_at: "2025-11-26 15:25:43", updated_at: "2025-12-03 12:12:44"
    },
    {
        id: 10, category_id: 3, name: "Cheesecake",
        description: "Classic New York cheesecake",
        price: 300.00,
        image: "https://via.placeholder.com/300x200?text=Cheesecake",
        servings: 1, preparation_time: 0,
        is_vegetarian: 0, is_vegan: 0, is_gluten_free: 0,
        rating: 0.0, total_ratings: 0, is_available: 1,
        created_at: "2025-11-26 15:25:43", updated_at: "2025-12-03 12:12:44"
    },
    {
        id: 11, category_id: 3, name: "Fruit Salad",
        description: "Fresh mixed fruit salad",
        price: 200.00,
        image: "https://via.placeholder.com/300x200?text=Fruit+Salad",
        servings: 1, preparation_time: 1,
        is_vegetarian: 0, is_vegan: 0, is_gluten_free: 0,
        rating: 0.0, total_ratings: 0, is_available: 1,
        created_at: "2025-11-26 15:25:43", updated_at: "2025-12-03 12:12:44"
    },
    {
        id: 12, category_id: 3, name: "Ice Cream Sundae",
        description: "Vanilla ice cream with toppings",
        price: 180.00,
        image: "https://via.placeholder.com/300x200?text=Ice+Cream+Sundae",
        servings: 1, preparation_time: 0,
        is_vegetarian: 0, is_vegan: 0, is_gluten_free: 0,
        rating: 0.0, total_ratings: 0, is_available: 1,
        created_at: "2025-11-26 15:25:43", updated_at: "2025-12-03 12:12:44"
    },
    {
        id: 13, category_id: 4, name: "Coffee",
        description: "Freshly brewed coffee",
        price: 120.00,
        image: "https://via.placeholder.com/300x200?text=Coffee",
        servings: 1, preparation_time: 1,
        is_vegetarian: 0, is_vegan: 0, is_gluten_free: 0,
        rating: 0.0, total_ratings: 0, is_available: 1,
        created_at: "2025-11-26 15:25:43", updated_at: "2025-12-03 12:12:44"
    },
    {
        id: 14, category_id: 4, name: "Orange Juice",
        description: "Fresh squeezed orange juice",
        price: 150.00,
        image: "https://via.placeholder.com/300x200?text=Orange+Juice",
        servings: 1, preparation_time: 1,
        is_vegetarian: 0, is_vegan: 0, is_gluten_free: 0,
        rating: 0.0, total_ratings: 0, is_available: 1,
        created_at: "2025-11-26 15:25:43", updated_at: "2025-12-03 12:12:44"
    },
    {
        id: 15, category_id: 4, name: "Soft Drink",
        description: "Assorted sodas",
        price: 80.00,
        image: "https://via.placeholder.com/300x200?text=Soft+Drink",
        servings: 1, preparation_time: 1,
        is_vegetarian: 0, is_vegan: 0, is_gluten_free: 0,
        rating: 0.0, total_ratings: 0, is_available: 1,
        created_at: "2025-11-26 15:25:43", updated_at: "2025-12-03 12:12:44"
    },
    {
        id: 16, category_id: 4, name: "Iced Tea",
        description: "Refreshing iced tea",
        price: 120.00,
        image: "https://via.placeholder.com/300x200?text=Iced+Tea",
        servings: 1, preparation_time: 1,
        is_vegetarian: 0, is_vegan: 0, is_gluten_free: 0,
        rating: 0.0, total_ratings: 0, is_available: 1,
        created_at: "2025-11-26 15:25:43", updated_at: "2025-12-03 12:12:44"
    },
    {
        id: 17, category_id: 5, name: "Paneer Tikka",
        description: "Indian cottage cheese with spices",
        price: 380.00,
        image: "https://via.placeholder.com/300x200?text=Paneer+Tikka",
        servings: 1, preparation_time: 0,
        is_vegetarian: 0, is_vegan: 0, is_gluten_free: 0,
        rating: 0.0, total_ratings: 0, is_available: 1,
        created_at: "2025-11-26 15:25:43", updated_at: "2025-12-03 12:12:44"
    },
    {
        id: 18, category_id: 5, name: "Buddha Bowl",
        description: "Healthy bowl with quinoa and veggies",
        price: 420.00,
        image: "https://via.placeholder.com/300x200?text=Buddha+Bowl",
        servings: 1, preparation_time: 1,
        is_vegetarian: 0, is_vegan: 0, is_gluten_free: 0,
        rating: 0.0, total_ratings: 0, is_available: 1,
        created_at: "2025-11-26 15:25:43", updated_at: "2025-12-03 12:12:44"
    },
    {
        id: 19, category_id: 5, name: "Mushroom Risotto",
        description: "Creamy risotto with mushrooms",
        price: 480.00,
        image: "https://via.placeholder.com/300x200?text=Mushroom+Risotto",
        servings: 1, preparation_time: 0,
        is_vegetarian: 0, is_vegan: 0, is_gluten_free: 0,
        rating: 0.0, total_ratings: 0, is_available: 1,
        created_at: "2025-11-26 15:25:43", updated_at: "2025-12-03 12:12:44"
    },
    {
        id: 20, category_id: 6, name: "Vegan Burger",
        description: "Plant-based burger with avocado",
        price: 350.00,
        image: "https://via.placeholder.com/300x200?text=Vegan+Burger",
        servings: 1, preparation_time: 1,
        is_vegetarian: 0, is_vegan: 0, is_gluten_free: 0,
        rating: 0.0, total_ratings: 0, is_available: 1,
        created_at: "2025-11-26 15:25:43", updated_at: "2025-12-03 12:12:44"
    },
    {
        id: 21, category_id: 6, name: "Tofu Pad Thai",
        description: "Thai noodles with crispy tofu",
        price: 400.00,
        image: "https://via.placeholder.com/300x200?text=Tofu+Pad+Thai",
        servings: 1, preparation_time: 1,
        is_vegetarian: 0, is_vegan: 0, is_gluten_free: 0,
        rating: 0.0, total_ratings: 0, is_available: 1,
        created_at: "2025-11-26 15:25:43", updated_at: "2025-12-03 12:12:44"
    },
    {
        id: 22, category_id: 6, name: "Chickpea Curry",
        description: "Aromatic curry with chickpeas",
        price: 320.00,
        image: "https://via.placeholder.com/300x200?text=Chickpea+Curry",
        servings: 1, preparation_time: 1,
        is_vegetarian: 0, is_vegan: 0, is_gluten_free: 0,
        rating: 0.0, total_ratings: 0, is_available: 1,
        created_at: "2025-11-26 15:25:43", updated_at: "2025-12-03 12:12:44"
    },
    {
        id: 23, category_id: 3, name: "Choco Pie",
        description: "An biscuit dipped by chocolate lava",
        price: 30.00,
        image: "/uploads/images/1764570850911-choco-pie.jpg",
        servings: 0, preparation_time: 0,
        is_vegetarian: 0, is_vegan: 0, is_gluten_free: 0,
        rating: 0.0, total_ratings: 0, is_available: 1,
        created_at: "2025-12-01 12:04:10", updated_at: "2025-12-01 12:04:10"
    },
    {
        id: 24, category_id: 5, name: "Mutton Mandhi",
        description: "Tender mutton slow-cooked over pit fire, served atop spiced rice with roasted nuts",
        price: 699.00,
        image: "/uploads/images/mutton-mandhi.jpg",
        servings: 5, preparation_time: 90,
        is_vegetarian: 0, is_vegan: 0, is_gluten_free: 0,
        rating: 4.9, total_ratings: 10, is_available: 1,
        created_at: "2025-12-02 12:00:00", updated_at: "2025-12-02 12:00:00"
    },
    {
        id: 25, category_id: 5, name: "Smoked Chicken Mandhi",
        description: "Yemeni-style mandi rice with charcoal-smoked chicken and roasted nuts",
        price: 639.00,
        image: "/uploads/images/chicken-mandhi.jpg",
        servings: 5, preparation_time: 75,
        is_vegetarian: 0, is_vegan: 0, is_gluten_free: 0,
        rating: 4.8, total_ratings: 18, is_available: 1,
        created_at: "2025-12-02 12:00:00", updated_at: "2025-12-02 12:00:00"
    },
    {
        id: 26, category_id: 5, name: "Coastal Fish Mandhi",
        description: "Coastal marinated fish on aromatic mandi rice with lemon zest",
        price: 619.00,
        image: "/uploads/images/fish-mandhi.jpg",
        servings: 5, preparation_time: 65,
        is_vegetarian: 0, is_vegan: 0, is_gluten_free: 0,
        rating: 4.6, total_ratings: 7, is_available: 1,
        created_at: "2025-12-02 12:00:00", updated_at: "2025-12-02 12:00:00"
    },
    {
        id: 27, category_id: 5, name: "Hyderabadi Dum Biryani",
        description: "Layered basmati rice, saffron, and slow-cooked chicken sealed in dum",
        price: 499.00,
        image: "/uploads/images/hyderabadi-biryani.jpg",
        servings: 4, preparation_time: 60,
        is_vegetarian: 0, is_vegan: 0, is_gluten_free: 0,
        rating: 4.9, total_ratings: 45, is_available: 1,
        created_at: "2025-12-02 12:00:00", updated_at: "2025-12-02 12:00:00"
    },
    {
        id: 28, category_id: 5, name: "Ambur Mutton Biryani",
        description: "Short-grain seeraga samba rice with tender mutton and spice-laced broth",
        price: 549.00,
        image: "/uploads/images/ambur-biryani.jpg",
        servings: 4, preparation_time: 70,
        is_vegetarian: 0, is_vegan: 0, is_gluten_free: 0,
        rating: 4.8, total_ratings: 22, is_available: 1,
        created_at: "2025-12-02 12:00:00", updated_at: "2025-12-02 12:00:00"
    },
    {
        id: 29, category_id: 5, name: "Royal Veg Biryani",
        description: "Seasonal vegetables tossed with caramelized onions and cashews",
        price: 459.00,
        image: "/uploads/images/veg-biryani.jpg",
        servings: 4, preparation_time: 55,
        is_vegetarian: 1, is_vegan: 1, is_gluten_free: 0,
        rating: 4.7, total_ratings: 14, is_available: 1,
        created_at: "2025-12-02 12:00:00", updated_at: "2025-12-02 12:00:00"
    },
    {
        id: 30, category_id: 5, name: "Mixed Mandhi",
        description: "Flavoured rice with all type of meet with the mixture of masalas",
        price: 2199.00,
        image: "/uploads/images/mixed-mandhi.jpg",
        servings: 5, preparation_time: 65,
        is_vegetarian: 0, is_vegan: 0, is_gluten_free: 0,
        rating: 4.6, total_ratings: 7, is_available: 1,
        created_at: "2025-12-02 12:00:00", updated_at: "2025-12-02 12:00:00"
    },
    {
        id: 31, category_id: 5, name: "panner tikka Biryani",
        description: "Panner with Seasonal vegetables tossed with caramelized onions and cashews",
        price: 799.00,
        image: "/uploads/images/paneer-biryani.jpg",
        servings: 4, preparation_time: 55,
        is_vegetarian: 1, is_vegan: 1, is_gluten_free: 0,
        rating: 4.7, total_ratings: 14, is_available: 1,
        created_at: "2025-12-02 12:00:00", updated_at: "2025-12-02 12:00:00"
    }
];

async function seedMenuItems() {
    let connection;

    try {
        // Always use individual variables from .env for local connections
        // MYSQL_URL contains Railway's internal hostname which doesn't work locally
        console.log('🔄 Connecting to Railway database using .env variables...');
        console.log(`   Host: ${process.env.DB_HOST}`);
        console.log(`   Database: ${process.env.DB_NAME}`);
        console.log(`   Port: ${process.env.DB_PORT}\n`);

        const connectionConfig = {
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT || 3306),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            connectTimeout: 60000, // 60 seconds
            ssl: {
                rejectUnauthorized: false
            }
        };

        connection = await mysql.createConnection(connectionConfig);

        console.log('✅ Connected to Railway database successfully!\n');

        // Check if table exists
        const [tables] = await connection.query(
            "SHOW TABLES LIKE 'menu_items'"
        );

        if (tables.length === 0) {
            console.error('❌ Error: menu_items table does not exist!');
            console.log('   Please run migrations first: railway run npm run db:migrate');
            process.exit(1);
        }

        console.log('🔄 Starting to seed menu items...\n');

        // Clear existing data
        await connection.query('DELETE FROM menu_items');
        console.log('   ✓ Cleared existing menu items');

        // Insert new data
        let count = 0;
        for (const item of menuItems) {
            await connection.query(
                `INSERT INTO menu_items 
                (id, category_id, name, description, price, image, servings, preparation_time,
                 is_vegetarian, is_vegan, is_gluten_free, rating, total_ratings, is_available,
                 created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    item.id, item.category_id, item.name, item.description, item.price,
                    item.image, item.servings, item.preparation_time, item.is_vegetarian,
                    item.is_vegan, item.is_gluten_free, item.rating, item.total_ratings,
                    item.is_available, item.created_at, item.updated_at
                ]
            );
            count++;
            if (count % 10 === 0) {
                console.log(`   ✓ Inserted ${count} items...`);
            }
        }

        console.log(`\n✅ Successfully seeded ${menuItems.length} menu items!\n`);

        // Verify the data
        const [rows] = await connection.query('SELECT COUNT(*) as count FROM menu_items');
        console.log(`📊 Total menu items in database: ${rows[0].count}`);

        await connection.end();
        console.log('\n✅ Database connection closed. Seeding complete! 🎉\n');

    } catch (error) {
        console.error('\n❌ Error seeding database:');
        console.error(`   ${error.message}`);

        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 Connection refused. Possible issues:');
            console.log('   1. Make sure you ran: railway link');
            console.log('   2. Make sure you run: railway run node scripts/seed-menu-railway.js');
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('\n💡 Access denied. Railway database credentials issue.');
        }

        process.exit(1);
    }
}

seedMenuItems();

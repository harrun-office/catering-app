// backend/scripts/seed-menu-items.js
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

async function createConnectionWithRetry(config, retries = 5, delay = 3000) {
    // Increase timeout for Railway connections
    config.connectTimeout = config.connectTimeout || 90000; // 90 seconds
    
    for (let i = 0; i < retries; i++) {
        try {
            console.log(`   Attempt ${i + 1}/${retries}...`);
            const conn = await mysql.createConnection(config);
            return conn;
        } catch (error) {
            if (i === retries - 1) throw error;
            console.log(`   ⚠️  Connection attempt ${i + 1} failed, retrying in ${delay/1000}s...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

async function seedMenuItems() {
    let connection = null;

    try {
        // Try using MYSQL_PUBLIC_URL first (Railway connection string)
        // But skip if it contains internal hostname (only works inside Railway)
        if (process.env.MYSQL_PUBLIC_URL && 
            !process.env.MYSQL_PUBLIC_URL.includes('mysql.railway.internal') &&
            process.env.MYSQL_PUBLIC_URL.includes('proxy.rlwy.net')) {
            console.log('🔄 Connecting using MYSQL_PUBLIC_URL...');
            try {
                const url = process.env.MYSQL_PUBLIC_URL.replace('mysql://', '');
                const [credentials, hostAndDb] = url.split('@');
                const [user, password] = credentials.split(':');
                const [hostPort, database] = hostAndDb.split('/');
                const [host, port] = hostPort.split(':');
                
                connection = await createConnectionWithRetry({
                    host: host,
                    port: Number(port),
                    user: decodeURIComponent(user),
                    password: decodeURIComponent(password),
                    database: database,
                    connectTimeout: 90000, // 90 seconds
                    ssl: {
                        rejectUnauthorized: false
                    }
                });
                console.log('✅ Connected using MYSQL_PUBLIC_URL!\n');
            } catch (urlError) {
                console.log('⚠️  MYSQL_PUBLIC_URL connection failed, trying fallback...');
                connection = null; // Will fall through to else block
            }
        }
        
        if (!connection) {
            // Always prefer proxy URL for local connections (even with railway run)
            // Only use internal hostname when actually running inside Railway
            let dbHost = process.env.RAILWAY_TCP_PROXY_DOMAIN || process.env.DB_HOST;
            let dbPort = process.env.RAILWAY_TCP_PROXY_PORT || process.env.DB_PORT || 3306;
            
            // If no proxy available, try internal (but this won't work locally)
            if (!dbHost || (!dbHost.includes('proxy.rlwy.net') && !dbHost.includes('railway'))) {
                dbHost = process.env.MYSQLHOST || process.env.DB_HOST;
                dbPort = process.env.MYSQLPORT || process.env.DB_PORT || 3306;
            }
            
            const dbUser = process.env.MYSQLUSER || process.env.DB_USER;
            const dbPassword = process.env.MYSQLPASSWORD || process.env.MYSQL_ROOT_PASSWORD || process.env.DB_PASSWORD;
            const dbName = process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || process.env.DB_NAME;

            console.log('🔄 Connecting to Railway database...');
            console.log(`   Host: ${dbHost}`);
            console.log(`   Database: ${dbName}`);
            console.log(`   Port: ${dbPort}`);

            const connectionConfig = {
                host: dbHost,
                port: Number(dbPort),
                user: dbUser,
                password: dbPassword,
                database: dbName,
                connectTimeout: 90000, // 90 seconds
                ssl: (dbHost && dbHost.includes('proxy.rlwy.net')) || (dbHost && dbHost.includes('railway')) ? {
                    rejectUnauthorized: false
                } : false
            };

            connection = await createConnectionWithRetry(connectionConfig);
        }

        console.log('✅ Connected to database successfully!\n');

        // Check if table exists
        const [tables] = await connection.query(
            "SHOW TABLES LIKE 'menu_items'"
        );

        if (tables.length === 0) {
            console.error('❌ Error: menu_items table does not exist!');
            console.log('   Please run migrations first: npm run db:migrate');
            process.exit(1);
        }

        console.log('🔄 Starting to seed menu items...\n');

        // Clear existing data
        await connection.query('DELETE FROM menu_items');
        console.log('   Cleared existing menu items');

        // Insert new data
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
        }

        console.log(`✅ Successfully seeded ${menuItems.length} menu items!\n`);

        // Verify the data
        const [rows] = await connection.query('SELECT COUNT(*) as count FROM menu_items');
        console.log(`📊 Total menu items in database: ${rows[0].count}`);

        await connection.end();
        console.log('\n✅ Database connection closed. Seeding complete!');

    } catch (error) {
        console.error('\n❌ Error seeding database:');
        console.error(`   ${error.message}`);
        console.error(`   Error code: ${error.code || 'N/A'}`);

        if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
            console.log('\n💡 Connection timeout/refused. Possible solutions:');
            console.log('   1. Check Railway Dashboard → MySQL service is RUNNING (not paused)');
            console.log('   2. Verify TCP Proxy is ENABLED in Railway settings');
            console.log('   3. Check if your IP/firewall is blocking port 14009');
            console.log('   4. Try running: railway run node scripts/seed-menu-items.js');
            console.log('   5. Or run the script from Railway\'s web console/terminal');
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('\n💡 Access denied. Check:');
            console.log('   1. DB_USER is correct (usually "root")');
            console.log('   2. DB_PASSWORD matches your Railway password');
        } else if (error.code === 'ENOTFOUND') {
            console.log('\n💡 Hostname not found. This usually means:');
            console.log('   1. You\'re trying to use internal Railway hostname locally');
            console.log('   2. Use DB_HOST with proxy.rlwy.net for local connections');
            console.log('   3. Or use: railway run node scripts/seed-menu-items.js');
        }

        console.log('\n📝 The script is configured correctly.');
        console.log('   The issue is network connectivity to Railway database.');
        console.log('   Please check your Railway dashboard to ensure the database is active.\n');
        
        process.exit(1);
    }
}

seedMenuItems();

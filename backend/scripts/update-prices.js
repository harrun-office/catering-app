const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const db = require('../config/database');

const updates = [
    { name: 'Spring Rolls', price: 250.00 },
    { name: 'Bruschetta', price: 280.00 },
    { name: 'Chicken Wings', price: 350.00 },
    { name: 'Shrimp Appetizer', price: 450.00 },
    { name: 'Grilled Salmon', price: 1450.00 },
    { name: 'Ribeye Steak', price: 1800.00 },
    { name: 'Chicken Parmesan', price: 650.00 },
    { name: 'Vegetable Stir Fry', price: 450.00 },
    { name: 'Chocolate Cake', price: 250.00 },
    { name: 'Cheesecake', price: 300.00 },
    { name: 'Fruit Salad', price: 200.00 },
    { name: 'Ice Cream Sundae', price: 180.00 },
    { name: 'Coffee', price: 120.00 },
    { name: 'Orange Juice', price: 150.00 },
    { name: 'Soft Drink', price: 80.00 },
    { name: 'Iced Tea', price: 120.00 },
    { name: 'Paneer Tikka', price: 380.00 },
    { name: 'Buddha Bowl', price: 420.00 },
    { name: 'Mushroom Risotto', price: 480.00 },
    { name: 'Vegan Burger', price: 350.00 },
    { name: 'Tofu Pad Thai', price: 400.00 },
    { name: 'Chickpea Curry', price: 320.00 },
    { name: 'Hyderabadi Dum Biryani', price: 499.00 },
    { name: 'Ambur Mutton Biryani', price: 549.00 },
    { name: 'Royal Veg Biryani', price: 459.00 },
    { name: 'Paneer Tikka Biryani', price: 479.00 },
    { name: 'Smoked Chicken Mandhi', price: 639.00 },
    { name: 'Mutton Mandhi', price: 699.00 },
    { name: 'Coastal Fish Mandhi', price: 619.00 },
    { name: 'Family Mixed Mandhi', price: 799.00 }
];

async function updatePrices() {
    console.log('Starting price updates...');
    let updatedCount = 0;
    let errorCount = 0;

    try {
        const connection = await db.getConnection();

        for (const item of updates) {
            try {
                const [result] = await connection.execute(
                    'UPDATE menu_items SET price = ? WHERE name = ?',
                    [item.price, item.name]
                );

                if (result.affectedRows > 0) {
                    console.log(`✓ Updated ${item.name} to ₹${item.price}`);
                    updatedCount++;
                } else {
                    console.log(`⚠ Item not found: ${item.name}`);
                }
            } catch (err) {
                console.error(`✗ Error updating ${item.name}:`, err.message);
                errorCount++;
            }
        }

        connection.release();
        console.log('\n====================================');
        console.log(`Update complete.`);
        console.log(`Updated: ${updatedCount}`);
        console.log(`Errors: ${errorCount}`);
        console.log('====================================');
        process.exit(errorCount > 0 ? 1 : 0);

    } catch (err) {
        console.error('Fatal error:', err);
        process.exit(1);
    }
}

updatePrices();

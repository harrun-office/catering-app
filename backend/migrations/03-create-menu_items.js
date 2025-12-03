'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('menu_items', {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
            category_id: { type: Sequelize.INTEGER, allowNull: false },
            name: { type: Sequelize.STRING(150), allowNull: false },
            description: { type: Sequelize.TEXT },
            price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
            image: { type: Sequelize.STRING(255) },
            servings: { type: Sequelize.INTEGER },
            preparation_time: { type: Sequelize.INTEGER },
            is_vegetarian: { type: Sequelize.BOOLEAN, defaultValue: false },
            is_vegan: { type: Sequelize.BOOLEAN, defaultValue: false },
            is_gluten_free: { type: Sequelize.BOOLEAN, defaultValue: false },
            rating: { type: Sequelize.DECIMAL(2, 1), defaultValue: 0 },
            total_ratings: { type: Sequelize.INTEGER, defaultValue: 0 },
            is_available: { type: Sequelize.BOOLEAN, defaultValue: true },
            created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
            updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
        });

        await queryInterface.addConstraint('menu_items', {
            fields: ['category_id'],
            type: 'foreign key',
            name: 'fk_menu_items_category',
            references: { table: 'categories', field: 'id' },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        await queryInterface.addIndex('menu_items', ['category_id'], { name: 'idx_category' });
        await queryInterface.addIndex('menu_items', ['is_available'], { name: 'idx_available' });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('menu_items');
    }
};

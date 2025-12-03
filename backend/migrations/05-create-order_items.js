'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('order_items', {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
            order_id: { type: Sequelize.INTEGER, allowNull: false },
            menu_item_id: { type: Sequelize.INTEGER, allowNull: false },
            quantity: { type: Sequelize.INTEGER, allowNull: false },
            unit_price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
            total_price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
            special_instructions: { type: Sequelize.TEXT },
            created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
        });

        await queryInterface.addConstraint('order_items', {
            fields: ['order_id'],
            type: 'foreign key',
            name: 'fk_order_items_order',
            references: { table: 'orders', field: 'id' },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        await queryInterface.addConstraint('order_items', {
            fields: ['menu_item_id'],
            type: 'foreign key',
            name: 'fk_order_items_menuitem',
            references: { table: 'menu_items', field: 'id' },
            onDelete: 'NO ACTION',
            onUpdate: 'CASCADE'
        });

        await queryInterface.addIndex('order_items', ['order_id'], { name: 'idx_order' });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('order_items');
    }
};

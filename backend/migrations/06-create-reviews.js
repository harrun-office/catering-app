'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('reviews', {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
            user_id: { type: Sequelize.INTEGER, allowNull: false },
            menu_item_id: { type: Sequelize.INTEGER, allowNull: false },
            order_id: { type: Sequelize.INTEGER },
            rating: { type: Sequelize.INTEGER },
            comment: { type: Sequelize.TEXT },
            created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
        });

        await queryInterface.addConstraint('reviews', {
            fields: ['user_id'],
            type: 'foreign key',
            name: 'fk_reviews_user',
            references: { table: 'users', field: 'id' },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        await queryInterface.addConstraint('reviews', {
            fields: ['menu_item_id'],
            type: 'foreign key',
            name: 'fk_reviews_menuitem',
            references: { table: 'menu_items', field: 'id' },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        await queryInterface.addConstraint('reviews', {
            fields: ['order_id'],
            type: 'foreign key',
            name: 'fk_reviews_order',
            references: { table: 'orders', field: 'id' },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        });

        await queryInterface.addIndex('reviews', ['menu_item_id'], { name: 'idx_item' });
        await queryInterface.addConstraint('reviews', {
            fields: ['user_id', 'menu_item_id'],
            type: 'unique',
            name: 'unique_review'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('reviews');
    }
};

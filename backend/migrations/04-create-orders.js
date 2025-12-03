'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('orders', {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
            user_id: { type: Sequelize.INTEGER, allowNull: false },
            order_number: { type: Sequelize.STRING(20), allowNull: false, unique: true },
            total_amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
            subtotal: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
            tax: { type: Sequelize.DECIMAL(10, 2) },
            delivery_charge: { type: Sequelize.DECIMAL(10, 2) },
            status: { type: Sequelize.ENUM('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'), defaultValue: 'pending' },
            payment_status: { type: Sequelize.ENUM('pending', 'completed', 'failed', 'refunded'), defaultValue: 'pending' },
            payment_method: { type: Sequelize.ENUM('credit_card', 'debit_card', 'upi', 'wallet'), defaultValue: 'credit_card' },
            delivery_address: { type: Sequelize.STRING(500) },
            delivery_date: { type: Sequelize.DATEONLY },
            delivery_time: { type: Sequelize.TIME },
            notes: { type: Sequelize.TEXT },
            created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
            updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
        });

        await queryInterface.addConstraint('orders', {
            fields: ['user_id'],
            type: 'foreign key',
            name: 'fk_orders_user',
            references: { table: 'users', field: 'id' },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        await queryInterface.addIndex('orders', ['user_id'], { name: 'idx_user' });
        await queryInterface.addIndex('orders', ['status'], { name: 'idx_status' });
        await queryInterface.addIndex('orders', ['created_at'], { name: 'idx_created' });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('orders');
    }
};

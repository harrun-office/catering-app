'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('payments', {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
            order_id: { type: Sequelize.INTEGER, allowNull: false, unique: true },
            user_id: { type: Sequelize.INTEGER, allowNull: false },
            amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
            payment_method: { type: Sequelize.ENUM('credit_card', 'debit_card', 'upi', 'wallet'), allowNull: false },
            transaction_id: { type: Sequelize.STRING(100), unique: true },
            status: { type: Sequelize.ENUM('pending', 'completed', 'failed'), defaultValue: 'pending' },
            gateway_response: { type: Sequelize.JSON },
            created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
            updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
        });

        await queryInterface.addConstraint('payments', {
            fields: ['order_id'],
            type: 'foreign key',
            name: 'fk_payments_order',
            references: { table: 'orders', field: 'id' },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        await queryInterface.addConstraint('payments', {
            fields: ['user_id'],
            type: 'foreign key',
            name: 'fk_payments_user',
            references: { table: 'users', field: 'id' },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        await queryInterface.addIndex('payments', ['user_id'], { name: 'idx_user' });
        await queryInterface.addIndex('payments', ['transaction_id'], { name: 'idx_transaction' });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('payments');
    }
};

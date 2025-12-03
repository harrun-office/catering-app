'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('coupons', {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
            code: { type: Sequelize.STRING(50), allowNull: false, unique: true },
            description: { type: Sequelize.TEXT },
            discount_type: { type: Sequelize.ENUM('percentage', 'fixed'), defaultValue: 'percentage' },
            discount_value: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
            min_order_amount: { type: Sequelize.DECIMAL(10, 2) },
            max_discount: { type: Sequelize.DECIMAL(10, 2) },
            usage_limit: { type: Sequelize.INTEGER },
            usage_count: { type: Sequelize.INTEGER, defaultValue: 0 },
            valid_from: { type: Sequelize.DATEONLY },
            valid_till: { type: Sequelize.DATEONLY },
            is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
            created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
            updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
        });

        await queryInterface.addIndex('coupons', ['code'], { name: 'idx_code' });
        await queryInterface.addIndex('coupons', ['is_active'], { name: 'idx_active' });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('coupons');
    }
};

'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
            first_name: { type: Sequelize.STRING(100), allowNull: false },
            last_name: { type: Sequelize.STRING(100), allowNull: false },
            email: { type: Sequelize.STRING(255), allowNull: false, unique: true },
            password: { type: Sequelize.STRING(255), allowNull: false },
            phone: { type: Sequelize.STRING(20) },
            address: { type: Sequelize.STRING(500) },
            city: { type: Sequelize.STRING(100) },
            zip_code: { type: Sequelize.STRING(10) },
            profile_image: { type: Sequelize.STRING(255) },
            role: { type: Sequelize.ENUM('user', 'admin'), defaultValue: 'user' },
            is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
            created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
            updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
        });

        await queryInterface.addIndex('users', ['email'], { name: 'idx_email' });
        await queryInterface.addIndex('users', ['role'], { name: 'idx_role' });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('users');
    }
};

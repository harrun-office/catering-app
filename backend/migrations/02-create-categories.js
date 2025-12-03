'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('categories', {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
            name: { type: Sequelize.STRING(100), allowNull: false, unique: true },
            description: { type: Sequelize.TEXT },
            image: { type: Sequelize.STRING(255) },
            is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
            created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
            updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
        });
        await queryInterface.addIndex('categories', ['name'], { name: 'idx_name' });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('categories');
    }
};

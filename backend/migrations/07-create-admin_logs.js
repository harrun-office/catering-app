'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('admin_logs', {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
            admin_id: { type: Sequelize.INTEGER, allowNull: false },
            action: { type: Sequelize.STRING(255), allowNull: false },
            description: { type: Sequelize.TEXT },
            table_name: { type: Sequelize.STRING(100) },
            record_id: { type: Sequelize.INTEGER },
            old_value: { type: Sequelize.JSON },
            new_value: { type: Sequelize.JSON },
            created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
        });

        await queryInterface.addConstraint('admin_logs', {
            fields: ['admin_id'],
            type: 'foreign key',
            name: 'fk_admin_logs_admin',
            references: { table: 'users', field: 'id' },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        await queryInterface.addIndex('admin_logs', ['admin_id'], { name: 'idx_admin' });
        await queryInterface.addIndex('admin_logs', ['action'], { name: 'idx_action' });
        await queryInterface.addIndex('admin_logs', ['created_at'], { name: 'idx_created' });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('admin_logs');
    }
};

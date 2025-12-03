'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
    async up(queryInterface, Sequelize) {
        const passwordHash = await bcrypt.hash('Admin@123', 10);
        return queryInterface.bulkInsert('users', [{
            first_name: 'Admin',
            last_name: 'User',
            email: 'admin@example.com',
            password: passwordHash,
            role: 'admin',
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
        }], {});
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('users', { email: 'admin@example.com' }, {});
    }
};

'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.Order, { foreignKey: 'user_id' });
            User.hasMany(models.Review, { foreignKey: 'user_id' });
            User.hasMany(models.AdminLog, { foreignKey: 'admin_id' });
            User.hasMany(models.Payment, { foreignKey: 'user_id' });
        }
    }
    User.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        phone: DataTypes.STRING,
        address: DataTypes.STRING,
        city: DataTypes.STRING,
        zip_code: DataTypes.STRING,
        profile_image: DataTypes.STRING,
        role: DataTypes.ENUM('user', 'admin'),
        is_active: DataTypes.BOOLEAN,
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: false
    });
    return User;
};

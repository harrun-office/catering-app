'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            Order.belongsTo(models.User, { foreignKey: 'user_id' });
            Order.hasMany(models.OrderItem, { foreignKey: 'order_id' });
            Order.hasMany(models.Review, { foreignKey: 'order_id' });
            Order.hasOne(models.Payment, { foreignKey: 'order_id' });
        }
    }
    Order.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        user_id: DataTypes.INTEGER,
        order_number: DataTypes.STRING,
        total_amount: DataTypes.DECIMAL,
        subtotal: DataTypes.DECIMAL,
        tax: DataTypes.DECIMAL,
        delivery_charge: DataTypes.DECIMAL,
        status: DataTypes.ENUM('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'),
        payment_status: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
        payment_method: DataTypes.ENUM('credit_card', 'debit_card', 'upi', 'wallet'),
        delivery_address: DataTypes.STRING,
        delivery_date: DataTypes.DATEONLY,
        delivery_time: DataTypes.TIME,
        notes: DataTypes.TEXT,
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'Order',
        tableName: 'orders',
        timestamps: false
    });
    return Order;
};

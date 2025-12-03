'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Payment extends Model {
        static associate(models) {
            Payment.belongsTo(models.Order, { foreignKey: 'order_id' });
            Payment.belongsTo(models.User, { foreignKey: 'user_id' });
        }
    }
    Payment.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        order_id: DataTypes.INTEGER,
        user_id: DataTypes.INTEGER,
        amount: DataTypes.DECIMAL,
        payment_method: DataTypes.ENUM('credit_card', 'debit_card', 'upi', 'wallet'),
        transaction_id: DataTypes.STRING,
        status: DataTypes.ENUM('pending', 'completed', 'failed'),
        gateway_response: DataTypes.JSON,
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'Payment',
        tableName: 'payments',
        timestamps: false
    });
    return Payment;
};

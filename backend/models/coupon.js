'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Coupon extends Model {
        static associate(models) { }
    }
    Coupon.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        code: DataTypes.STRING,
        description: DataTypes.TEXT,
        discount_type: DataTypes.ENUM('percentage', 'fixed'),
        discount_value: DataTypes.DECIMAL,
        min_order_amount: DataTypes.DECIMAL,
        max_discount: DataTypes.DECIMAL,
        usage_limit: DataTypes.INTEGER,
        usage_count: DataTypes.INTEGER,
        valid_from: DataTypes.DATEONLY,
        valid_till: DataTypes.DATEONLY,
        is_active: DataTypes.BOOLEAN,
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'Coupon',
        tableName: 'coupons',
        timestamps: false
    });
    return Coupon;
};

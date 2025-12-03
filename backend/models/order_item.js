'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class OrderItem extends Model {
        static associate(models) {
            OrderItem.belongsTo(models.Order, { foreignKey: 'order_id' });
            OrderItem.belongsTo(models.MenuItem, { foreignKey: 'menu_item_id' });
        }
    }
    OrderItem.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        order_id: DataTypes.INTEGER,
        menu_item_id: DataTypes.INTEGER,
        quantity: DataTypes.INTEGER,
        unit_price: DataTypes.DECIMAL,
        total_price: DataTypes.DECIMAL,
        special_instructions: DataTypes.TEXT,
        created_at: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'OrderItem',
        tableName: 'order_items',
        timestamps: false
    });
    return OrderItem;
};

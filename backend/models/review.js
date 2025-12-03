'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Review extends Model {
        static associate(models) {
            Review.belongsTo(models.User, { foreignKey: 'user_id' });
            Review.belongsTo(models.MenuItem, { foreignKey: 'menu_item_id' });
            Review.belongsTo(models.Order, { foreignKey: 'order_id' });
        }
    }
    Review.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        user_id: DataTypes.INTEGER,
        menu_item_id: DataTypes.INTEGER,
        order_id: DataTypes.INTEGER,
        rating: DataTypes.INTEGER,
        comment: DataTypes.TEXT,
        created_at: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'Review',
        tableName: 'reviews',
        timestamps: false
    });
    return Review;
};

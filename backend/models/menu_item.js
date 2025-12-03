'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class MenuItem extends Model {
        static associate(models) {
            MenuItem.belongsTo(models.Category, { foreignKey: 'category_id' });
            MenuItem.hasMany(models.Review, { foreignKey: 'menu_item_id' });
            MenuItem.hasMany(models.OrderItem, { foreignKey: 'menu_item_id' });
        }
    }
    MenuItem.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        category_id: DataTypes.INTEGER,
        name: DataTypes.STRING,
        description: DataTypes.TEXT,
        price: DataTypes.DECIMAL,
        image: DataTypes.STRING,
        servings: DataTypes.INTEGER,
        preparation_time: DataTypes.INTEGER,
        is_vegetarian: DataTypes.BOOLEAN,
        is_vegan: DataTypes.BOOLEAN,
        is_gluten_free: DataTypes.BOOLEAN,
        rating: DataTypes.DECIMAL,
        total_ratings: DataTypes.INTEGER,
        is_available: DataTypes.BOOLEAN,
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'MenuItem',
        tableName: 'menu_items',
        timestamps: false
    });
    return MenuItem;
};

'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AdminLog extends Model {
        static associate(models) {
            AdminLog.belongsTo(models.User, { foreignKey: 'admin_id' });
        }
    }
    AdminLog.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        admin_id: DataTypes.INTEGER,
        action: DataTypes.STRING,
        description: DataTypes.TEXT,
        table_name: DataTypes.STRING,
        record_id: DataTypes.INTEGER,
        old_value: DataTypes.JSON,
        new_value: DataTypes.JSON,
        created_at: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'AdminLog',
        tableName: 'admin_logs',
        timestamps: false
    });
    return AdminLog;
};

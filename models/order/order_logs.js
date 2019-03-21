"use strict";
module.exports = function (sequelize, DataTypes) {
    let OrderLogs = sequelize.define(
        "OrderLogs", {
            id: {
                type: DataTypes.INTEGER(),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            username: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            orderid: {
                type: DataTypes.BIGINT(),
                allowNull: false
            },
            action: {
                type: DataTypes.STRING(40),
                allowNull: true
            },
            before: {
                type: DataTypes.STRING(2000),
                allowNull: true
            },
            after: {
                type: DataTypes.STRING(2000),
                allowNull: true
            }
        },{
            freezeTableName:true,
            tableName:"OrderLogs"
        });
    OrderLogs.associate=function(models) {
        OrderLogs.belongsTo(models.User,{
            foreignKey:"username",
            targetKey:"username"
        });
    };
    return OrderLogs;
};
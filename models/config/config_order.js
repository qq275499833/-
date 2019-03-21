"use strict";
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        "OrderConfig", {
            id: {
                type: DataTypes.INTEGER(),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            server: {
                type: DataTypes.STRING(200),
                allowNull: true
            },
            bakserver1: {
                type: DataTypes.STRING(200),
                allowNull: true
            },
            bakserver2: {
                type: DataTypes.STRING(200),
                allowNull: true
            },
            bakserver3: {
                type: DataTypes.STRING(200),
                allowNull: true
            }
        },{
            freezeTableName:true,
            tableName:'ConfigOrder'
        });
};
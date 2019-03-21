"use strict";
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        "QYWXConfig", {
            id: {
                type: DataTypes.INTEGER(),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            enable: {
                type: DataTypes.STRING(10),
                allowNull: true
            },
            wxappid: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            agentid: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            secret: {
                type: DataTypes.STRING(100),
                allowNull: true
            }
        },{
            freezeTableName:true,
            tableName:'ConfigQYWX'
        });
};
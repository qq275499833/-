"use strict";
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        "ExportConfig", {
            id: {
                type: DataTypes.INTEGER(),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            pass: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            server: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            url: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            hook_server: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            hook_url: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            wms_url: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            wms_pass: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            clock_account:{
                type: DataTypes.STRING(100),
                allowNull: true
            },
            clock_password:{
                type: DataTypes.STRING(100),
                allowNull: true
            },
            clock_url:{
                type: DataTypes.STRING(100),
                allowNull: true
            },
            prefix_orderid:{
                type: DataTypes.STRING(20),
                allowNull: true
            }
        },{
            freezeTableName:true,
            tableName:'ConfigExport'
        });
};
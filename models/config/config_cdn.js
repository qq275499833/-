"use strict";
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        "CDNConfig", {
            id: {
                type: DataTypes.INTEGER(),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            cdntype: {
                type: DataTypes.STRING(10),
                allowNull: true
            },
            accesskey: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            secretkey: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            bucket: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            region: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            cdnbase: {
                type: DataTypes.STRING(100),
                allowNull: true
            }
        },{
            freezeTableName:true,
            tableName:'ConfigCDN'
        });
};
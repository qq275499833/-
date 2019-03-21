"use strict";
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        "WebConfig", {
            servers: {
                type: DataTypes.STRING(1000),
                allowNull: true
            },
            staticpath: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            imgpath: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            apiserver: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            cacheserver: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            saveviewcount: {
                type: DataTypes.STRING(10),
                allowNull: true
            },
            debug: {
                type: DataTypes.STRING(10),
                allowNull: true
            },
            port: {
                type: DataTypes.INTEGER(),
                allowNull: true
            }
        },{
            freezeTableName:true,
            tableName:'WebConfigs'
        });
};
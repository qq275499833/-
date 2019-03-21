"use strict";
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        "ConfigPT", {
            ptname: {
                type: DataTypes.STRING(30),
                allowNull: true
            },
            ptsubname: {
                type: DataTypes.STRING(30),
                allowNull: true
            },
            ptloginenable: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            ptlogininfo: {
                type: DataTypes.STRING(200),
                allowNull: true
            },
            debug: {
                type: DataTypes.STRING(10),
                allowNull: true
            },
            theme: {
                type: DataTypes.STRING(10),
                allowNull: true
            },
            appid: {
                type: DataTypes.STRING(10),
                allowNull: true
            }
        },{
            freezeTableName:true,
            tableName:'ConfigPT'
        });
};
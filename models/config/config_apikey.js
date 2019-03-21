"use strict";
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        "ApikeyConfig", {
            id: {
                type: DataTypes.INTEGER(),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            jdwxapikey: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            trackingmoreapikey: {
                type: DataTypes.STRING(50),
                allowNull: true
            }
        },{
            freezeTableName:true,
            tableName:'ConfigApikey'
        });
};
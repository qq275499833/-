"use strict";
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        "HLConfig", {
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
            NT: {
                type: DataTypes.DECIMAL(10,2),
                allowNull: true
            },
            HK: {
                type: DataTypes.DECIMAL(10,2),
                allowNull: true
            },
            RM: {
                type: DataTypes.DECIMAL(10,2),
                allowNull: true
            },
            SS: {
                type: DataTypes.DECIMAL(10,2),
                allowNull: true
            },
            TH: {
                type: DataTypes.DECIMAL(10,2),
                allowNull: true
            },
            Rp: {
                type: DataTypes.DECIMAL(10,2),
                allowNull: true
            },
            $: {
                type: DataTypes.DECIMAL(10,2),
                allowNull: true
            },
            JPN: {
                type: DataTypes.DECIMAL(10,2),
                allowNull: true
            }
        },{
            freezeTableName:true,
            tableName:'ConfigHL'
        });
};
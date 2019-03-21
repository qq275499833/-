"use strict";
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        "ExpressConfig", {
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
            hm_interval: {
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            hm_lasttime: {
                type: DataTypes.BIGINT(),
                allowNull: true
            },
            sf_interval: {
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            sf_lasttime: {
                type: DataTypes.BIGINT(),
                allowNull: true
            },
            dhlm_interval: {
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            dhlm_lasttime: {
                type: DataTypes.BIGINT(),
                allowNull: true
            },
            xz_interval: {
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            xz_lasttime: {
                type: DataTypes.BIGINT(),
                allowNull: true
            },
            njv_interval: {
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            njv_lasttime: {
                type: DataTypes.BIGINT(),
                allowNull: true
            },
            jl_interval: {
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            jl_lasttime: {
                type: DataTypes.BIGINT(),
                allowNull: true
            }
        },{
            freezeTableName:true,
            tableName:'ConfigExpress'
        });
};
"use strict";
module.exports = function(sequelize, DataTypes) {
    let OrderSites = sequelize.define(
        "OrderSite",
        {
            orderid: {
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                autoIncrement: false
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            money: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            template: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            language: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            siteurl: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            redirecturl: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            skip_switch:{
                type: DataTypes.INTEGER(),
                allowNull: true
            }
        },{
            freezeTableName:true,
            tableName:"OrderSites"
        });
    OrderSites.associate=function(models) {
        OrderSites.belongsTo(models.OrderBasic,{
            foreignKey:"orderid",
            targetKey:"orderid"
        });
    };
    return OrderSites;
};
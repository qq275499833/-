"use strict";
module.exports = function(sequelize, DataTypes) {
    let OrderGoods = sequelize.define(
        "OrderGoods",
        {
            id: {
                type: DataTypes.INTEGER(),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            orderid: {
                type: DataTypes.BIGINT(),
                allowNull: false
            },
            goodsid: {
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            sourceid: {
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            specid: {
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            spu: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            sku: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            goodsname: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            specname: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            img: {
                type: DataTypes.STRING(200),
                allowNull: true
            },
            option1: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            option2: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            option3: {
                type: DataTypes.STRING(500),
                allowNull: true
            },
            price: {
                type: DataTypes.DECIMAL(10, 0),
                allowNull: true
            },
            number: {
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            username: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            gift: {
                type: DataTypes.INTEGER(),
                allowNull: true
            },
        },{
            freezeTableName:true,
            tableName:"OrderGoods"
        });
    OrderGoods.associate=function(models) {
        OrderGoods.belongsTo(models.User,{
            foreignKey:"username",
            targetKey:"username"
        });
        OrderGoods.belongsTo(models.OrderBasic,{
            foreignKey:"orderid",
            targetKey:"orderid"
        });
        OrderGoods.belongsTo(models.Goods,{
            foreignKey:"goodsid",
            targetKey:"id"
        });
    };
    return OrderGoods;
};
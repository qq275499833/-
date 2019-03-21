"use strict";
module.exports = function(sequelize, DataTypes) {
    let OrderBasic = sequelize.define(
        "OrderBasic",
        {
            orderid: {
                type: DataTypes.BIGINT(),
                allowNull: false,
                primaryKey: true
            },
            ordertime: {
                type: DataTypes.STRING(28),
                allowNull: false
            },         
            language: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            money: {
                type: DataTypes.STRING(10),
                allowNull: true
            },
            orderprice: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true
            },
            orderpriceRMB: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true
            },
            orderstate: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            expressnumber: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            expressname: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            expresstime: {
                type: DataTypes.STRING(28),
                allowNull: true
            },
            expressinfo: {
                type: DataTypes.STRING,
                allowNull: true
            },
            clientip: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            clientlocation: {
                type: DataTypes.STRING(500),
                allowNull: true
            },
            clientreferer: {
                type: DataTypes.STRING(500),
                allowNull: true
            },
            clientname: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            clientphone: {
                type: DataTypes.STRING(22),
                allowNull: true
            },
            clientzipcode: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            clientphoneinfo: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            clientemail: {
                type: DataTypes.STRING(50),
                defaultValue: "",
                allowNull: true
            },
            clientaddress: {
                type: DataTypes.STRING(500),
                allowNull: true
            },
            clientdispatchtime: {
                type: DataTypes.STRING(30),
                defaultValue: "任何时间",
                allowNull: true
            },
            clientotherinfo: {
                type: DataTypes.STRING(500),
                defaultValue: "",
                allowNull: true
            },      
            username: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            isrepeat: {
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            confirmetime: {
                type: DataTypes.STRING(28),
                allowNull: true
            },
            state:{
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            leadername: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            payment:{
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            store_delivery: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
        },{
            freezeTableName:true,
            tableName:"OrderBasic"
        });

    OrderBasic.associate=function(models) {
        OrderBasic.belongsTo(models.User,{
            foreignKey:"username",
            targetKey:"username"
        });
        OrderBasic.belongsTo(models.User,{
            as: 'User2',
            constraints: false,
            foreignKey:"leadername",
            targetKey:"username"
        });
        OrderBasic.hasMany(models.OrderGoods,{
            foreignKey:"orderid",
            targetKey:"orderid"
        });
        OrderBasic.hasOne(models.OrderSite,{
            foreignKey:"orderid",
            targetKey:"orderid"
        });
        OrderBasic.hasOne(models.OrderPaypal,{
            foreignKey:"orderid",
            targetKey:"orderid"
        });
    };
    return OrderBasic;
};
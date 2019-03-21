"use strict";
module.exports = function(sequelize, DataTypes) {
    let BlackOrder = sequelize.define(
        "BlackOrder",
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
            goodsinfo: {
                type: DataTypes.STRING(2000),
                allowNull: true
            },
            siteinfo: {
                type: DataTypes.STRING(1000),
                allowNull: true
            },
            good_id: {
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            site_id: {
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            language: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            orderprice: {
                type: DataTypes.DECIMAL(10, 0),
                allowNull: true
            },
            orderpriceRMB: {
                type: DataTypes.DECIMAL(10, 0),
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
                type: DataTypes.STRING(1000),
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
            export_id: {
                type: DataTypes.INTEGER(),
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
            tid: {
                type: DataTypes.INTEGER(),
                allowNull: true
            }
        },{
            freezeTableName:true,
            tableName:"BlackOrders"
        });
    BlackOrder.associate=function(models) {
        BlackOrder.belongsTo(models.User,{
            foreignKey:"username",
            targetKey:"username"
        });
        BlackOrder.belongsTo(models.ExportRecord,{
            foreignKey:"export_id",
            targetKey:"id"
        });
    };
    return BlackOrder;
};
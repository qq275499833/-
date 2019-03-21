"use strict";
module.exports = function(sequelize, DataTypes) {
    let OrderPaypal = sequelize.define(
        "OrderPaypal",
        {
            orderid: {
                type: DataTypes.BIGINT(20),
                allowNull: false,
                primaryKey: true
            },
            payid:{
                type: DataTypes.STRING(255),
                allowNull: true
            },
            paymentid:{
                type: DataTypes.STRING(255),
                allowNull: true
            },
            paymenttoken: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            returnurl: {
                type: DataTypes.STRING(225),
                allowNull: true
            },
            orderidP:{
                type: DataTypes.STRING(255),
                allowNull: true
            }
        },{
            freezeTableName:true,
            tableName:"OrderPaypal"
        });

    OrderPaypal.associate=function(models) {
        OrderPaypal.belongsTo(models.OrderBasic,{
            foreignKey:"orderid",
            targetKey:"orderid"
        });
    };
    return OrderPaypal;
};
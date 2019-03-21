"use strict";
module.exports = function (sequelize, DataTypes) {
    let GoodsStatus = sequelize.define(
        "GoodsStatus", {
            id: {
                type: DataTypes.INTEGER(),
                allowNull: false,
                primaryKey: true
            },
            username: {
                type: DataTypes.STRING(20),
                allowNull: false
            },
            viewcount: {
                type: DataTypes.INTEGER(),
                allowNull: false
            },
            purchasecount: {
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            salesmoney: {
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            copycount: {
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            returnedcount:{
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            returnedmoney:{
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            lastsoldtime: {
                type: DataTypes.DATE(),
                allowNull: true
            }
        },{
            freezeTableName:true,
            tableName:"GoodsStatuses"
        });
    GoodsStatus.associate=function(models) {
        GoodsStatus.belongsTo(models.Goods,{
            foreignKey:"id",
            targetKey:"id"
        });
        GoodsStatus.belongsTo(models.User,{
            foreignKey:"username",
            targetKey:"username"
        });
    };
    return GoodsStatus;
};
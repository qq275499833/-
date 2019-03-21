"use strict";
module.exports = function (sequelize, DataTypes) {
    let GoodsCode = sequelize.define(
        "GoodsCode", {
            id: {
                type: DataTypes.INTEGER(),
                allowNull: false,
                primaryKey: true
            },
            username: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            ggcode: {
                type: DataTypes.STRING(2000),
                allowNull: true
            },
            tjcode: {
                type: DataTypes.STRING(2000),
                allowNull: true
            },
            kfcode: {
                type: DataTypes.STRING(2000),
                allowNull: true
            }
        },{
            freezeTableName:true,
            tableName:"GoodsCode"
        });
    GoodsCode.associate=function(models) {
        GoodsCode.belongsTo(models.Goods,{
            foreignKey:"id",
            targetKey:"id"
        });
        GoodsCode.belongsTo(models.User,{
            foreignKey:"username",
            targetKey:"username"
        });
    };
    return GoodsCode;
};
"use strict";
module.exports = function (sequelize, DataTypes) {
    let GoodsContent = sequelize.define(
        "GoodsContent", {
            id: {
                type: DataTypes.INTEGER(),
                allowNull: false,
                primaryKey: true
            },
            username: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            content: {
                type: DataTypes.TEXT('medium'),
                allowNull: true
            },
            version: {
                type: DataTypes.INTEGER(),
                defaultValue:0,
                allowNull: true
            }
        },{
            freezeTableName:true,
            tableName:"GoodsContent"
        });
    GoodsContent.associate=function(models) {
        GoodsContent.belongsTo(models.Goods,{
            foreignKey:"id",
            targetKey:"id"
        });
        GoodsContent.belongsTo(models.User,{
            foreignKey:"username",
            targetKey:"username"
        });
    };
    return GoodsContent;
};
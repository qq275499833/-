"use strict";
module.exports = function (sequelize, DataTypes) {
    let GoodsPromotion = sequelize.define(
        "GoodsPromotion",
        {
            id: {
                type: DataTypes.INTEGER(),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            promotion_type: {//促销信息类型 1合计价格满减 2合计件数满减 3合计件数一口价 4单件优惠
                type: DataTypes.INTEGER(),
                allowNull: false
            },
            name: {//名称
                type: DataTypes.STRING(),
                allowNull: true
            },
            count: {//件数
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            price1: {//价格1
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            price2: {//价格2
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            gift_count: {//赠品件数
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            gifts_id:{
                type: DataTypes.STRING(50),
                allowNull: true
            }
        }, {
            freezeTableName:true,
            tableName:'GoodsPromotion'
        });
    GoodsPromotion.associate=function (models) {
        GoodsPromotion.belongsTo(models.Goods);
    };
    return GoodsPromotion;
};
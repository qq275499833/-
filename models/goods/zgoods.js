"use strict";
module.exports = function (sequelize, DataTypes) {
    let Goods = sequelize.define(
        "Goods",
        {
            id: {
                type: DataTypes.INTEGER(),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            state: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            userkey: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            type1: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            type2: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            type3: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            head_imgs: {
                type: DataTypes.STRING(1000),
                allowNull: true
            },
            saleoff:{
                type: DataTypes.STRING(500),
                allowNull: true
            },
            username: {
                type: DataTypes.STRING(20),
                allowNull: false
            },
            isshare: {
                type: DataTypes.STRING(10),
                allowNull: true
            },
            option1_name: {
                type: DataTypes.STRING(50),
                allowNull: true,
                defaultValue:''
            },
            option2_name: {
                type: DataTypes.STRING(50),
                allowNull: true,
                defaultValue:''
            },
            option3_name: {
                type: DataTypes.STRING(50),
                allowNull: true,
                defaultValue:''
            },
            sitename: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            sitedesc: {
                type: DataTypes.STRING(4000),
                allowNull: true
            },
            price: {
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            oldprice: {
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            color: {
                type: DataTypes.STRING(20),
                allowNull: false
            },
            template: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            language: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            money: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            body_ads: {
                type: DataTypes.STRING(500),
                allowNull: true
            },
            order_ads: {
                type: DataTypes.STRING(500),
                allowNull: true
            },
            manyoff: {
                type: DataTypes.STRING(500),
                allowNull: true
            },
            gifts: {
                type: DataTypes.STRING(500),
                allowNull: true
            },
            sitedir: {
                type: DataTypes.STRING(200),
                allowNull: true
            },
            source: {
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            saleno: {
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            father: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            t: {
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            manyoff_new: {
                type: DataTypes.STRING(500),
                allowNull: true
            },
            adcode: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            othercode: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            fblink: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            linelink: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            whatsapplink: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            chaport_id: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            about_id: {
                type: DataTypes.STRING(),
                allowNull: true
            },
            contact_id: {
                type: DataTypes.STRING(),
                allowNull: true
            },
            privacy_id: {
                type: DataTypes.STRING(),
                allowNull: true
            },
            terms_id: {
                type: DataTypes.STRING(),
                allowNull: true
            },
            service_id: {
                type: DataTypes.STRING(),
                allowNull: true
            },
            add_info: {
                type: DataTypes.STRING(),
                allowNull: true
            },
            home_id: {
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            head_video: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            count_info: {
                type: DataTypes.STRING(1000),
                allowNull: true
            },
            paypal_id:{
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            countdown:{
                type: DataTypes.STRING(255),
                allowNull: true
            },
            order_prompt_info:{
                type: DataTypes.STRING(),
                allowNull: true
            },
            homename: {
                type: DataTypes.STRING(500),
                allowNull: true
            },
            home_select:{
                type: DataTypes.INTEGER(),
                allowNull: true,
            },
            sale_num: {
                type: DataTypes.STRING(),
                allowNull: true
            },
            skip_switch: {
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            skip_url: {
                type:DataTypes.STRING(300),
                allowNull: true
            },
            chaport_switch:{
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            priceoff:{
                type: DataTypes.STRING(500),
                allowNull: true
            },
            skip_id:{
                type:DataTypes.STRING(300),
                allowNull: true
            },
            is_domain:{
                type: DataTypes.BOOLEAN(),
                allowNull: true
            },
            promotion_sort:{
                type: DataTypes.STRING(10),
                allowNull: true
            }
        }, {
            freezeTableName:true,
            tableName:'Goods'
        });
    Goods.associate=function (models) {
        Goods.belongsTo(models.Domain);
        Goods.belongsTo(models.Paypal);
        Goods.belongsTo(models.GoodsTheme, {
            foreignKey: "template",
            targetKey: "filename"
        });
        Goods.belongsTo(models.User, {
            foreignKey: "username",
            targetKey: "username"
        });
        Goods.hasMany(models.GoodsComment);
        Goods.hasMany(models.GoodsSpec);
        Goods.hasMany(models.GoodsPromotion);
        Goods.hasMany(models.GoodsLogs);
        Goods.hasMany(models.OrderGoods,{
            foreignKey: "id",
            targetKey: "goodsid"
        });
        Goods.hasOne(models.GoodsStatus, {
            foreignKey: "id",
            targetKey: "id"
        });
        Goods.hasOne(models.GoodsContent, {
            foreignKey: "id",
            targetKey: "id"
        });
        Goods.hasOne(models.GoodsCode, {
            foreignKey: "id",
            targetKey: "id"
        });

    };
    return Goods;
};
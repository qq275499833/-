"use strict";

module.exports = function(sequelize, DataTypes) {
let GoodsSpec = sequelize.define(
    "GoodsSpec",
    {
        id: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        sku: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        name: {
            type: DataTypes.STRING(100),
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
            type: DataTypes.STRING(100),
            allowNull: true
        },
        img: {
            type: DataTypes.STRING(1000),
            allowNull: true
        },
        price: {
            type: DataTypes.INTEGER(),
            allowNull: false
        },
        isdefault: {
            type: DataTypes.INTEGER(),
            allowNull: true,
            defaultValue:0
        },
        username: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        name_private: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        option1_private: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        option2_private: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        option3_private: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        inventory:{
            type: DataTypes.INTEGER(),
            allowNull: true
        }
    },{
        freezeTableName:true,
        tableName:"GoodsSpecs"
    });
    GoodsSpec.associate=function(models) {
        GoodsSpec.belongsTo(models.Goods);
        GoodsSpec.belongsTo(models.User,{
            foreignKey:"username",
            targetKey:"username"
        });
    };
    return GoodsSpec;
};
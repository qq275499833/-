"use strict";

module.exports = function(sequelize, DataTypes) {
    let GoodsHome = sequelize.define(
        "GoodsHome",
        {
            id: {
                type: DataTypes.INTEGER(),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            sitedir: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            logo: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            sitename: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            sitedesc: {
                type: DataTypes.STRING(500),
                allowNull: false
            },
            color: {
                type: DataTypes.STRING(20),
                allowNull: false
            },
            template: {
                type: DataTypes.STRING(20),
                allowNull: false
            },
            language: {
                type: DataTypes.STRING(20),
                allowNull: false
            },
            heads: {
                type: DataTypes.STRING(600),
                allowNull: false
            },
            types: {
                type: DataTypes.STRING(3000),
                allowNull: false
            },
            username: {
                type: DataTypes.STRING(20),
                allowNull: false
            },
            status: {
                type: DataTypes.STRING(10),
                allowNull: false
            },
            original: {
                type: DataTypes.STRING(10),
                allowNull: false
            },
        },{
            freezeTableName:true,
            tableName:'GoodsHomes'
        });
    GoodsHome.associate=function(models) {
        GoodsHome.belongsTo(models.User, {
            foreignKey: "username",
            targetKey: "username"
        });
    };
    return GoodsHome;
};
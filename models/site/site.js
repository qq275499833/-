"use strict";

module.exports = function(sequelize, DataTypes) {
    let Site = sequelize.define(
        "Site",
        {
            id: {
                type: DataTypes.INTEGER(),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING(30),
                allowNull: false
            },
            sitename: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            keywords: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            description: {
                type: DataTypes.STRING(300),
                allowNull: false
            },
            sitedesc: {
                type: DataTypes.STRING(500),
                allowNull: true
            },
            color: {
                type: DataTypes.STRING(20),
                allowNull: false
            },
            template: {
                type: DataTypes.INTEGER(),
                allowNull: false
            },
            language: {
                type: DataTypes.STRING(20),
                allowNull: false
            },
            money:{
                type: DataTypes.STRING(20),
                allowNull: false
            },
            state: {
                type: DataTypes.STRING(10),
                allowNull: true
            },
            domain: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            logo: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            footermenu: {
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
            username: {
                type: DataTypes.STRING(20),
                allowNull: false
            }
        },{
            freezeTableName:true,
            tableName:'Site'
        });

    Site.associate=function(models) {
        Site.belongsTo(models.Domain);
        Site.belongsTo(models.SiteTheme, {
            foreignKey: "template",
            targetKey: "id"
        });
        Site.belongsTo(models.User, {
            foreignKey: "username",
            targetKey: "username"
        });
        Site.hasOne(models.SiteHome);
        Site.hasMany(models.SiteClass);
    };
    return Site;
};
"use strict";

module.exports = function (sequelize, DataTypes) {
    let SiteTheme = sequelize.define(
        "SiteTheme",
        {
            id: {
                type: DataTypes.INTEGER(),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING(20),
                allowNull: false
            },
            author: {
                type: DataTypes.STRING(20),
                allowNull: false
            },
            keywords: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            description: {
                type: DataTypes.STRING(200),
                allowNull: false
            },
            classtype: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            color: {
                type: DataTypes.STRING(20),
                allowNull: false
            },
            iswide:{
                type: DataTypes.STRING(10),
                allowNull: false
            },
            isslide:{
                type: DataTypes.STRING(10),
                allowNull: false
            },
            state: {
                type: DataTypes.STRING(10),
                allowNull: true
            },
            img: {
                type: DataTypes.STRING(500),
                allowNull: true
            },
            filename: {
                type: DataTypes.STRING(500),
                allowNull: true
            },
            username: {
                type: DataTypes.STRING(20),
                allowNull: false
            }
        }, {
            freezeTableName: true,
            tableName: 'SiteThemes'
        });

    SiteTheme.associate=function (models) {
        SiteTheme.hasMany(models.Site,{
            foreignKey: "id",
            targetKey: "template"
        });
        SiteTheme.belongsTo(models.User, {
            foreignKey: "username",
            targetKey: "username"
        });
    };
    return SiteTheme;
};
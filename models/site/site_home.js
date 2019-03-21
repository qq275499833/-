"use strict";

module.exports = function(sequelize, DataTypes) {
    let SiteHome = sequelize.define(
        "SiteHome",
        {
            id: {
                type: DataTypes.INTEGER(),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            username: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            head_goods: {
                type: DataTypes.STRING(600),
                allowNull: true
            },
            hot_goods: {
                type: DataTypes.STRING(600),
                allowNull: true
            },
            middle_goods: {
                type: DataTypes.STRING(600),
                allowNull: true
            },
            bottom_goods: {
                type: DataTypes.STRING(600),
                allowNull: true
            },
            hot_text: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            middle_text: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            bottom_text: {
                type: DataTypes.STRING(100),
                allowNull: true
            }
        },{
            freezeTableName:true,
            tableName:'SiteHome'
        });
    SiteHome.associate=function(models) {
        SiteHome.belongsTo(models.Site);
        SiteHome.belongsTo(models.User, {
            foreignKey: "username",
            targetKey: "username"
        });
    };
    return SiteHome;
};
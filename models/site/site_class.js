"use strict";

module.exports = function(sequelize, DataTypes) {
    let SiteClass = sequelize.define(
        "SiteClass",
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
            isshow: {
                type: DataTypes.STRING(5),
                allowNull: true
            },
            sortindex: {
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            typename: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            typecontent: {
                type: DataTypes.STRING(500),
                allowNull: true
            }
        },{
            freezeTableName:true,
            tableName:'SiteClass'
        });

    SiteClass.associate=function(models) {
        SiteClass.belongsTo(models.Site);
        SiteClass.belongsTo(models.User, {
            foreignKey: "username",
            targetKey: "username"
        });
    };
    return SiteClass;
};
"use strict";

module.exports = function(sequelize, DataTypes) {
let Domain = sequelize.define(
    "Domain",
    {
        id: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        username: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        isshare: {
            type: DataTypes.STRING(10),
            allowNull: true
        },
        sitecount: {
            type: DataTypes.INTEGER(),
            allowNull: true
        },
        state: {
            type: DataTypes.STRING(10),
            allowNull: true
        },
        desc: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    },{
        freezeTableName:true,
        tableName:"Domains"
    });
    Domain.associate=function(models) {
        Domain.hasMany(models.Goods);
        Domain.hasMany(models.Site);
        Domain.belongsTo(models.User,{
            foreignKey:"username",
            targetKey:"username",
            onDelete:"NO ACTION"
        });
    };
    return Domain;
};
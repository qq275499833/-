"use strict";

module.exports = function(sequelize, DataTypes) {
let BlackInfo = sequelize.define(
    "BlackInfo",
    {
        id: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        phone: {
            type: DataTypes.STRING(50),
            unique:true,
            allowNull: true
        },
        ip: {
            type: DataTypes.STRING(50),
            unique:true,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING(80),
            allowNull: true
        },
        username: {
            type: DataTypes.STRING(20),
            allowNull: true
        }
    },{
        freezeTableName:true,
        tableName:"BlackInfos"
    });
    BlackInfo.associate=function(models) {
        BlackInfo.belongsTo(models.User,{
            foreignKey:"username",
            targetKey:"username",
            onDelete:"NO ACTION"
        });
    };
    return BlackInfo;
};
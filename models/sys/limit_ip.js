"use strict";

module.exports = function(sequelize, DataTypes) {
let LimitIP = sequelize.define(
    "LimitIP",
    {
        id: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        clientip: {
            type: DataTypes.STRING(50),
            unique:true,
            allowNull: true
        },
        username: {
            type: DataTypes.STRING(20),
            allowNull: true
        }
    },{
        freezeTableName:true,
        tableName:"LimitIP"
    });
    LimitIP.associate=function(models) {
        LimitIP.belongsTo(models.User,{
            foreignKey:"username",
            targetKey:"username",
            onDelete:"NO ACTION"
        });
    };
    return LimitIP;
};
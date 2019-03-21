"use strict";

module.exports = function(sequelize, DataTypes) {
let LimitName = sequelize.define(
    "LimitName",
    {
        id: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        clientname: {
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
        tableName:"LimitName"
    });
    LimitName.associate=function(models) {
        LimitName.belongsTo(models.User,{
            foreignKey:"username",
            targetKey:"username",
            onDelete:"NO ACTION"
        });
    };
    return LimitName;
};
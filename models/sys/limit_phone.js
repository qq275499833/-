"use strict";

module.exports = function(sequelize, DataTypes) {
let LimitPhone = sequelize.define(
    "LimitPhone",
    {
        id: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        clientphone: {
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
        tableName:"LimitPhone"
    });
    LimitPhone.associate=function(models) {
        LimitPhone.belongsTo(models.User,{
            foreignKey:"username",
            targetKey:"username",
            onDelete:"NO ACTION"
        });
    };
    return LimitPhone;
};
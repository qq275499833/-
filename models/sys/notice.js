"use strict";

module.exports = function(sequelize, DataTypes) {
let Notice = sequelize.define(
    "Notice",
    {
        id: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        body: {
            type: DataTypes.STRING(10000),
            allowNull: false
        },
        username: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        type: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        endtime: {
            type: DataTypes.DATE(),
            allowNull: true
        }
    },{
        freezeTableName:true,
        tableName:"Notices"
    });
    Notice.associate=function(models) {
        Notice.belongsTo(models.User,{
            foreignKey:"username",
            targetKey:"username",
            onDelete:"NO ACTION"
        });
    };
    return Notice;
};
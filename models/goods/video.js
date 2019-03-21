"use strict";

module.exports = function(sequelize, DataTypes) {
let Video = sequelize.define(
    "Video",
    {
        id: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        filename: {
            type: DataTypes.STRING(1000),
            allowNull: true
        },
        username: {
            type: DataTypes.STRING(20),
            allowNull: false
        }
    },{
        freezeTableName:true,
        tableName:"Videos"
    });

    Video.associate=function(models) {
        Video.belongsTo(models.User,{
            foreignKey:"username",
            targetKey:"username"
        });
    };
    return Video;
};
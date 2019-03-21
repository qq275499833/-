"use strict";

module.exports = function(sequelize, DataTypes) {
let Image = sequelize.define(
    "Image",
    {
        id: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        imagetype: {
            type: DataTypes.STRING(10),
            allowNull: true
        },
        sortindex: {
            type: DataTypes.INTEGER(),
            allowNull: true
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
        tableName:"Images"
    });
    Image.associate= function(models) {
        Image.belongsTo(models.User,{
            foreignKey:"username",
            targetKey:"username"
        });
    };
    return Image;
};
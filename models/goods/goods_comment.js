"use strict";

module.exports = function(sequelize, DataTypes) {
let Comment = sequelize.define(
    "GoodsComment",
    {
        id: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        body: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        imgs: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        username: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        isshow:{
            type: DataTypes.INTEGER(),
            allowNull: true,
            defaultValue: 1
        },
        sitedir: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        referer: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        localion: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        specinfo: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        star: {
            type: DataTypes.INTEGER(),
            allowNull: true,
            defaultValue: 5
        }
    },{
        freezeTableName:true,
        tableName:"GoodsComments"
    });
    Comment.associate=function(models) {
            Comment.belongsTo(models.Goods);
            Comment.belongsTo(models.User,{
                foreignKey:"username",
                targetKey:"username"
            });
    };
    return Comment;
};
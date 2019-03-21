"use strict";

module.exports = function(sequelize, DataTypes) {
    let Page = sequelize.define(
        "Page",
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
            name: {
                type: DataTypes.STRING(30),
                allowNull: true
            },
            linkname: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            title: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            classtype: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            language: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            isdefault: {
                type: DataTypes.STRING(10),
                allowNull: true
            },
            keywords: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            description: {
                type: DataTypes.STRING(300),
                allowNull: true
            },
            body: {
                type: DataTypes.STRING(20000),
                allowNull: true
            }
        },{
            freezeTableName:true,
            tableName:'Pages'
        });
    Page.associate=function(models) {
        Page.belongsTo(models.User, {
            foreignKey: "username",
            targetKey: "username"
        });
    };
    return Page;
};
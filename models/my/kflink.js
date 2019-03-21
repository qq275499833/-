"use strict";
module.exports = function (sequelize, DataTypes) {
    let KFLink = sequelize.define(
        "KFLink",
        {
            id: {
                type: DataTypes.INTEGER(),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            type: {
                type: DataTypes.STRING(10),
                allowNull: false
            },
            isshare: {
                type: DataTypes.STRING(10),
                allowNull: true
            },
            value: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            state: {
                type: DataTypes.STRING(10),
                allowNull: true
            },
            desc: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            username: {
                type: DataTypes.STRING(20),
                allowNull: true
            }
        },{
            freezeTableName:true,
            tableName:"KFLink"
        });

    KFLink.associate=function(models) {
        KFLink.belongsTo(models.User,{
            foreignKey:"username",
            targetKey:"username",
            onDelete:"NO ACTION"
        });
    };
    return KFLink;
};
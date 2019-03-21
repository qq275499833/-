"use strict";

module.exports = function(sequelize, DataTypes) {
    let WhiteInfo = sequelize.define(
        "WhiteInfo",
        {
            id: {
                type: DataTypes.INTEGER(),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            ip: {
                type: DataTypes.STRING(50),
                unique:true,
                allowNull: true
            },
            username: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            city: {
                type: DataTypes.STRING(20),
                allowNull: true
            }
        },{
            freezeTableName:true,
            tableName:"WhiteInfos"
        });
    WhiteInfo.associate=function(models) {
        WhiteInfo.belongsTo(models.User,{
            foreignKey:"username",
            targetKey:"username",
            onDelete:"NO ACTION"
        });
    };
    return WhiteInfo;
};
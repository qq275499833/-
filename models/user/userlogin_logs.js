"use strict";
module.exports = function (sequelize, DataTypes) {
    let UserLoginLogs = sequelize.define(
        "UserLoginLogs", {
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
            action: {
                type: DataTypes.STRING(40),
                allowNull: true
            },
            loginret: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            ip: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            local: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            isMobile: {
                type: DataTypes.STRING(10),
                allowNull: true
            },
            ip_isp: {
                type: DataTypes.STRING(10),
                allowNull: true
            },
            platform: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            os: {
                type: DataTypes.STRING(10),
                allowNull: true
            },
            browser: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            language: {
                type: DataTypes.STRING(10),
                allowNull: true
            },
            before: {
                type: DataTypes.STRING(500),
                allowNull: true
            }
        },{
            freezeTableName:true,
            tableName:"UserLoginLogs"
        });
    UserLoginLogs.associate=function(models) {
        UserLoginLogs.belongsTo(models.User,{
            foreignKey:"username",
            targetKey:"username"
        });
    };
    return UserLoginLogs;
};
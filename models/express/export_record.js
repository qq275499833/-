"use strict";
module.exports = function (sequelize, DataTypes) {
    let ExportRecord = sequelize.define(
        "ExportRecord", {
            id: {
                type: DataTypes.INTEGER(),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            date: {
                type: DataTypes.STRING(32),
                allowNull: true
            },
            state: {
                type: DataTypes.STRING(20),
                allowNull: false
            },
            ordercount: {
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            exportfilename: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            info: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            username: {
                type: DataTypes.STRING(20),
                allowNull: true
            }
        },{
            freezeTableName:true,
            tableName:"ExportRecords"
        });
    ExportRecord.associate=function(models) {
        ExportRecord.belongsTo(models.User,{
            foreignKey:"username",
            targetKey:"username"
        });
    };
    return ExportRecord;
};
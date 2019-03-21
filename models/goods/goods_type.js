"use strict";

module.exports = function(sequelize, DataTypes) {
return sequelize.define(
    "GoodsType",
    {
        id: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        father: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        fatherid: {
            type: DataTypes.INTEGER(),
            allowNull: true
        },
        classtype: {
            type: DataTypes.STRING(10),
            allowNull: false
        }
    },{
        freezeTableName:true,
        tableName:"GoodsTypes"
    });
};
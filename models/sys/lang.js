"use strict";
module.exports = function(sequelize, DataTypes) {
    return sequelize.define(
        "Lang",
        {
            id: {
                type: DataTypes.INTEGER(),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            src: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            tw: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            hk: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            my: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            sg: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            th: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            en: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            jpn:{
                type: DataTypes.STRING(100),
                allowNull: true
            }
        },{
            freezeTableName:true,
            tableName:'Langs'
        });
};
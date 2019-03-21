"use strict";

module.exports = function(sequelize, DataTypes) {
    let TelRules = sequelize.define(
        "TelRules",
        {
            id: {
                type: DataTypes.INTEGER(),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            country: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            tel_num_min: {
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            tel_num_max: {
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            tel_rule:{
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            enable:{
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            start_limit:{
                type: DataTypes.STRING(255),
                allowNull: true
            },
            start_limit_num:{
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            start_limit_rule:{
                type: DataTypes.INTEGER(),
                allowNull: true
            }
        },{
            freezeTableName:true,
            tableName:"TelRules"
        });
    TelRules.associate=function(models) {
        TelRules.belongsTo(models.User,{
            foreignKey:"username",
            targetKey:"username",
            onDelete:"NO ACTION"
        });
    };
    return TelRules;
};
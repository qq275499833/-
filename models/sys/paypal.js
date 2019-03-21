"use strict";

module.exports = function(sequelize, DataTypes) {
    let Paypal = sequelize.define(
        "Paypal",
        {
            id: {
                type: DataTypes.INTEGER(),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            username: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            isshare: {
                type: DataTypes.STRING(10),
                allowNull: true
            },
            paycode: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            state: {
                type: DataTypes.STRING(10),
                allowNull: true
            },
            desc: {
                type: DataTypes.STRING(255),
                allowNull: true
            }
        },{
            freezeTableName:true,
            tableName:"Paypal"
        });
    Paypal.associate=function(models) {
        Paypal.hasMany(models.Goods);
        /*Paypal.hasMany(models.Site);*/
        Paypal.belongsTo(models.User,{
            foreignKey:"username",
            targetKey:"username",
            onDelete:"NO ACTION"
        });
    };
    return Paypal;
};
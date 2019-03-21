"use strict";
module.exports = function (sequelize, DataTypes) {
    let Roi = sequelize.define(
        "Roi", {
            id: {
                type: DataTypes.INTEGER(),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            username: {
                type: DataTypes.STRING(20),
                allowNull: false
            },
            date: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            ordercount: {
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            orderamount: {
                type: DataTypes.INTEGER(),
                allowNull: true
            },
            spend: {
                type: DataTypes.DOUBLE(10, 2),
                allowNull: true
            },
            price: {
                type: DataTypes.DOUBLE(10, 2),
                allowNull: true
            },
            roi: {
                type: DataTypes.DOUBLE(10, 2),
                allowNull: true
            }
        },{
            freezeTableName:true,
            tableName:"Roi"
        });
    Roi.associate=function(models) {
        Roi.belongsTo(models.User,{
            foreignKey:"username",
            targetKey:"username"
        });
	    Roi.hasMany(models.RoiSpend);
    };
    return Roi;
};
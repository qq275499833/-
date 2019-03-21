"use strict";
module.exports = function (sequelize, DataTypes) {
    let Code = sequelize.define(
        "Code",
        {
            id: {
                type: DataTypes.INTEGER(),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true
            },
            type: {
                type: DataTypes.STRING(10),
                allowNull: false
            },
            subtype: {
                type: DataTypes.STRING(10),
                allowNull: true
            },
            area: {
                type: DataTypes.STRING(10),
                allowNull: true
            },
            state: {
                type: DataTypes.STRING(10),
                allowNull: true
            },
            headcode: {
                type: DataTypes.STRING(2000),
                allowNull: true
            },
            code: {
                type: DataTypes.STRING(2000),
                allowNull: true
            },
            username: {
                type: DataTypes.STRING(20),
                allowNull: true
            }
        },{
            freezeTableName:true,
            tableName:"Codes"
        });

    Code.associate=function(models) {
        Code.belongsTo(models.User,{
            foreignKey:"username",
            targetKey:"username",
            onDelete:"NO ACTION"
        });
    };
    return Code;
};
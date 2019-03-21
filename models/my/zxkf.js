"use strict";
module.exports = function (sequelize, DataTypes) {
    let KFOnline = sequelize.define(
        "KFOnline",
        {
            id: {
                type: DataTypes.INTEGER(),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            name:{
                type: DataTypes.STRING(20),
                allowNull: true
            },
            isshare: {
                type: DataTypes.STRING(10),
                allowNull: true
            },
            chaport_id: {
                type: DataTypes.STRING(100),
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
            tableName:"KFOnline"
        });

    KFOnline.associate=function(models) {
        KFOnline.belongsTo(models.User,{
            foreignKey:"username",
            targetKey:"username",
            onDelete:"NO ACTION"
        });
    };
    return KFOnline;
};
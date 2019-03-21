"use strict";

module.exports = function(sequelize, DataTypes) {
    let RemoteArea = sequelize.define(
        "RemoteArea",
        {
            id: {
                type: DataTypes.INTEGER(),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            city: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            area: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            zipCode: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            extrapay: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            isArrive: {
                type: DataTypes.INTEGER(),//0不可送达  1可送达
                allowNull: true
            },
            isallow: {
                type: DataTypes.STRING(50),//0不允许  1允许
                allowNull: true
            },
            userName: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            status: {
                type: DataTypes.INTEGER(),//0：台湾  1：香港 2：新加坡 3：印尼 4：泰国 5：马来
                allowNull: true
            }
        },{
            freezeTableName:true,
            tableName:"RemoteArea"
        });
    RemoteArea.associate= function(models) {
        RemoteArea.belongsTo(models.User,{
            foreignKey:"username",
            targetKey:"username"
        });
    };
    return RemoteArea;
};
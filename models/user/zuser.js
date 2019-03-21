"use strict";
module.exports = function(sequelize, DataTypes) {
    let User = sequelize.define("User", {
        id: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(32),
            allowNull: false
        },
        nickname: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        sendmail:{
            type:DataTypes.STRING(5),
            allowNull:true
        },
        email:{
            type:DataTypes.STRING(100),
            allowNull:true
        },
        smtp:{
            type:DataTypes.STRING(255),
            allowNull:true
        },
        smtpuser:{
            type:DataTypes.STRING(255),
            allowNull:true
        },
        smtppass:{
            type:DataTypes.STRING(255),
            allowNull:true
        },
        ggcode:{
            type:DataTypes.STRING(1000),
            allowNull:true
        },
        tjcode:{
            type:DataTypes.STRING(1000),
            allowNull:true
        },
        kfcode:{
            type:DataTypes.STRING(1000),
            allowNull:true
        },
        fblink:{
            type:DataTypes.STRING(100),
            allowNull:true
        },
        linelink:{
            type:DataTypes.STRING(100),
            allowNull:true
        },
        whatsapplink:{
            type:DataTypes.STRING(100),
            allowNull:true
        },
        chaport_id:{
            type:DataTypes.STRING(100),
            allowNull:true
        },
        order: {
            type: DataTypes.STRING(10),
            allowNull: true
        },
        goods: {
            type: DataTypes.STRING(10),
            allowNull: true
        },
        site: {
            type: DataTypes.STRING(10),
            allowNull: true
        },
        user: {
            type: DataTypes.STRING(10),
            allowNull: true
        },
        express: {
            type: DataTypes.STRING(10),
            allowNull: true
        },
        sys: {
            type: DataTypes.STRING(10),
            allowNull: true
        },
        role: {
            type: DataTypes.STRING(10),
            allowNull: true
        },
        isleader: {
            type: DataTypes.STRING(10),
            allowNull: true
        },
        leadername: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        openid:{
            type: DataTypes.STRING(50),
            allowNull: true
        },
        mp_openid:{
            type: DataTypes.STRING(50),
            allowNull: true
        },
        open_unionid:{
            type: DataTypes.STRING(50),
            allowNull: true
        },
        headimgurl:{
            type: DataTypes.STRING(500),
            allowNull: true
        },
        groupname:{
            type: DataTypes.STRING,
            allowNull: true
        },
        state:{
            type: DataTypes.STRING,
            allowNull: true
        }
    },{
        freezeTableName:true,
        tableName:"Users",
        indexes:[{
            method:'BTREE',
            fields:['username']
        }]
    });
    User.associate=function (models) {
        User.belongsTo(models.User,{
            as: 'User2',
            constraints: false,
            foreignKey:"leadername",
            targetKey:"username"
        });
        User.hasMany(models.BlackInfo, {
            foreignKey: "username",
            targetKey: "username"
        });
        User.hasMany(models.Domain, {
            foreignKey: "username",
            targetKey: "username"
        });
        User.hasMany(models.Goods, {
            foreignKey: "username",
            targetKey: "username"
        });
        User.hasMany(models.GoodsComment, {
            foreignKey: "username",
            targetKey: "username"
        });
        User.hasMany(models.GoodsLogs, {
            foreignKey: "username",
            targetKey: "username"
        });
        User.hasMany(models.GoodsSpec, {
            foreignKey: "username",
            targetKey: "username"
        });
        User.hasMany(models.GoodsStatus, {
            foreignKey: "username",
            targetKey: "username"
        });
        User.hasMany(models.GoodsContent, {
            foreignKey: "username",
            targetKey: "username"
        });
        User.hasMany(models.GoodsCode, {
            foreignKey: "username",
            targetKey: "username"
        });
        User.hasMany(models.Image, {
            foreignKey: "username",
            targetKey: "username"
        });
        User.hasMany(models.OrderLogs, {
            foreignKey: "username",
            targetKey: "username"
        });
        User.hasMany(models.SysLogs, {
            foreignKey: "username",
            targetKey: "username"
        });
        User.hasMany(models.UserLogs, {
            foreignKey: "username",
            targetKey: "username"
        });
        User.hasMany(models.UserLoginLogs, {
            foreignKey: "username",
            targetKey: "username"
        });
        User.hasMany(models.Site, {
            foreignKey: "username",
            targetKey: "username"
        });
        User.hasMany(models.SiteHome, {
            foreignKey: "username",
            targetKey: "username"
        });
        User.hasMany(models.SiteClass, {
            foreignKey: "username",
            targetKey: "username"
        });
        User.hasMany(models.Page, {
            foreignKey: "username",
            targetKey: "username"
        });
    };
    return User;
};
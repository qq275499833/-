"use strict";
const fs = require("fs");
const path = require("path");
const config = global.config;
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.mysql[config.appid].sqlBase,
    config.mysql[config.appid].sqlUser,
    config.mysql[config.appid].sqlPass,
    {
        dialect: 'mysql',
        host: config.mysql[config.appid].sqlHost,
        port: config.mysql[config.appid].sqlPort?config.mysql[config.appid].sqlPort:3306,
        define: {
            'underscored': true
        },
        pool: {
            max: 30,
            min: 2,
            idle: 60000
        },
        logging:global.env==='development'?console.log:false,
        benchmark:global.env==='development'
    });
let db = {};
fs.readdirSync(__dirname).filter(function (file) {
    return (file !== "index.js");
}).forEach(function (file) {
    let url = path.join(__dirname, file);
    if(fs.statSync(url).isDirectory()){
        fs.readdirSync(url).forEach(function (subfile) {
            let model = sequelize.import(path.join(__dirname, file, subfile));
            db[model.name] = model;
        });
    }else{
        let model = sequelize.import(url);
        db[model.name] = model;
    }
});
Object.keys(db).forEach(function (modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
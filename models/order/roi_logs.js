"use strict";
module.exports = function (sequelize, DataTypes) {
	let RoiLog = sequelize.define(
		"RoiLog", {
			id: {
				type: DataTypes.INTEGER(),
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},
			username: {
				type: DataTypes.STRING(20),
				allowNull: true
			},
			action: {
				type: DataTypes.STRING(40),
				allowNull: true
			},
			before: {
				type: DataTypes.STRING(3000),
				allowNull: true
			},
			after: {
				type: DataTypes.STRING(3000),
				allowNull: true
			},
			ip: {
				type: DataTypes.STRING(50),
				allowNull: true
			},
			local: {
				type: DataTypes.STRING(50),
				allowNull: true
			},
			isMobile: {
				type: DataTypes.STRING(10),
				allowNull: true
			}
		},{
			freezeTableName:true,
			tableName:"RoiLogs"
		});
	RoiLog.associate=function(models) {
		RoiLog.belongsTo(models.Roi);
		RoiLog.belongsTo(models.User,{
			foreignKey:"username",
			targetKey:"username"
		});
	};
	return RoiLog;
};
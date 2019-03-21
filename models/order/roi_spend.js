"use strict";
module.exports = function (sequelize, DataTypes) {
	let RoiSpend = sequelize.define(
		"RoiSpend", {
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
			name: {
				type: DataTypes.STRING(50),
				allowNull: false
			},
			value: {
				type: DataTypes.DOUBLE(10, 2),
				allowNull: true
			},
			remark: {
				type: DataTypes.STRING(100),
				allowNull: false
			}
		},{
			freezeTableName:true,
			tableName:"RoiSpends"
		});
	RoiSpend.associate=function(models) {
		RoiSpend.belongsTo(models.User,{
			foreignKey:"username",
			targetKey:"username"
		});
	};
	return RoiSpend;
};
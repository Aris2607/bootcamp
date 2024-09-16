"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Departments extends Model {
    static associate(models) {
      Departments.hasMany(models.Employees, { foreignKey: "department_id" });
      Departments.hasMany(models.Positions, { foreignKey: "department_id" });
    }
  }

  Departments.init(
    {
      name: DataTypes.STRING(50),
    },
    {
      sequelize,
      modelName: "Departments",
      freezeTableName: true,
    }
  );

  return Departments;
};

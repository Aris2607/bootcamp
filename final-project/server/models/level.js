"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Levels extends Model {
    static associate(models) {
      Levels.hasMany(models.EmployeePositions, { foreignKey: "level_id" });
    }
  }
  Levels.init(
    {
      level_name: DataTypes.STRING(50),
    },
    {
      sequelize,
      modelName: "Levels",
      freezeTableName: true,
    }
  );

  return Levels;
};

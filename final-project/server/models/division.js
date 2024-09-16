"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Divisions extends Model {
    static associate(models) {
      Divisions.hasMany(models.Employees, { foreignKey: "division_id" });
      Divisions.hasMany(models.Positions, { foreignKey: "division_id" });
      Divisions.hasMany(models.Chats, {
        foreignKey: "division_id",
      });
    }
  }

  Divisions.init(
    {
      name: DataTypes.STRING(50),
    },
    {
      sequelize,
      modelName: "Divisions",
      freezeTableName: true,
    }
  );

  return Divisions;
};

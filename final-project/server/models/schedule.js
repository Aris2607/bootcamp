"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Schedules extends Model {
    static associate(models) {
      Schedules.belongsToMany(models.Employees, {
        through: models.EmployeeSchedules,
        foreignKey: "schedule_id",
      });
    }
  }

  Schedules.init(
    {
      name: DataTypes.STRING(50),
      day: DataTypes.ENUM(
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ),
      start_time: DataTypes.TIME,
      end_time: DataTypes.TIME,
      late_tolerance: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Schedules",
      freezeTableName: true,
    }
  );

  return Schedules;
};

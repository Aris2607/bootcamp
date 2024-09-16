"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class EmployeeSchedules extends Model {
    static associate(models) {}
  }

  EmployeeSchedules.init(
    {
      employee_id: {
        type: DataTypes.INTEGER,
        references: { model: "Employees", key: "id" },
      },
      schedule_id: {
        type: DataTypes.INTEGER,
        references: { model: "Schedules", key: "id" },
      },
    },
    {
      sequelize,
      modelName: "EmployeeSchedules",
      freezeTableName: true,
    }
  );

  return EmployeeSchedules;
};

"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Attendances extends Model {
    static associate(models) {
      Attendances.belongsTo(models.Employees, { foreignKey: "employee_id" });
    }
  }

  Attendances.init(
    {
      employee_id: {
        type: DataTypes.INTEGER,
        references: { model: "Employees", key: "id" },
      },
      date: DataTypes.DATEONLY,
      time_in: DataTypes.TIME,
      time_out: DataTypes.TIME,
      status: DataTypes.ENUM("On Time", "Late", "Absent", "Leave"),
      location: DataTypes.STRING, // Geolocation data
    },
    {
      sequelize,
      modelName: "Attendances",
      freezeTableName: true,
    }
  );

  return Attendances;
};

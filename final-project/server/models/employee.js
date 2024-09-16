"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Employees extends Model {
    static associate(models) {
      Employees.belongsTo(models.Positions, { foreignKey: "position_id" });
      Employees.belongsTo(models.Departments, { foreignKey: "department_id" });
      Employees.belongsTo(models.Divisions, { foreignKey: "division_id" });
      Employees.hasMany(models.Attendances, { foreignKey: "employee_id" });
      Employees.hasMany(models.Leaves, { foreignKey: "employee_id" });
      Employees.hasOne(models.Users, { foreignKey: "employee_id" });
      Employees.belongsToMany(models.Schedules, {
        through: models.EmployeeSchedules,
        foreignKey: "employee_id",
      });
    }
  }

  Employees.init(
    {
      first_name: DataTypes.STRING(30),
      last_name: DataTypes.STRING(30),
      email: DataTypes.STRING(50),
      phone_number: DataTypes.STRING(15),
      position_id: {
        type: DataTypes.INTEGER,
        references: { model: "Positions", key: "id" },
      },
      department_id: {
        type: DataTypes.INTEGER,
        references: { model: "Departments", key: "id" },
      },
      division_id: {
        type: DataTypes.INTEGER,
        references: { model: "Divisions", key: "id" },
      },
      profile_picture: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Employees",
      freezeTableName: true,
    }
  );

  return Employees;
};

"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class EmployeePositions extends Model {
    static associate(models) {
      EmployeePositions.belongsTo(models.Employees, {
        foreignKey: "employee_id",
      });
      EmployeePositions.belongsTo(models.Positions, {
        foreignKey: "position_id",
      });
      EmployeePositions.belongsTo(models.Levels, { foreignKey: "level_id" });
    }
  }
  EmployeePositions.init(
    {
      employee_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Employees",
          key: "id",
        },
      },
      position_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Positions",
          key: "id",
        },
      },
      level_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Levels",
          key: "id",
        },
      },
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "EmployeePositions",
      freezeTableName: true,
    }
  );

  return EmployeePositions;
};

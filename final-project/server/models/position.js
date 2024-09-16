"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Positions extends Model {
    static associate(models) {
      Positions.hasMany(models.Employees, { foreignKey: "position_id" });
      Positions.belongsTo(models.Departments, { foreignKey: "department_id" });
      Positions.belongsTo(models.Divisions, { foreignKey: "division_id" });
    }
  }
  Positions.init(
    {
      name: DataTypes.STRING(30),
      department_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Departments",
          key: "id",
        },
      },
      division_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Divisions",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Positions",
      freezeTableName: true,
    }
  );

  return Positions;
};

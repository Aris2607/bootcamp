"use strict";
const { Model } = require("sequelize");
// const { FOREIGNKEYS } = require("sequelize/lib/query-types");
module.exports = (sequelize, DataTypes) => {
  class Employees extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Employees.belongsTo(models.Positions, { foreignKey: "position_id" });
      Employees.belongsTo(models.Departments, { foreignKey: "department_id" });
      Employees.hasMany(models.Attandances, { foreignKey: "employee_id" });
      Employees.hasMany(models.Leaves, { foreignKey: "employee_id" });
      Employees.hasMany(models.Users, { foreignKey: "employee_id" });
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
        references: {
          model: "Positions",
          key: "id",
        },
      },
      department_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Departments",
          key: "id",
        },
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

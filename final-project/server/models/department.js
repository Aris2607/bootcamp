"use strict";
const { Model } = require("sequelize");
// const { FOREIGNKEYS } = require("sequelize/lib/query-types");
module.exports = (sequelize, DataTypes) => {
  class Departments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Departments.hasMany(models.Employees, { foreignKey: "department_id" });
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

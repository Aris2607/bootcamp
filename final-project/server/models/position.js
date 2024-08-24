"use strict";
const { Model } = require("sequelize");
// const { FOREIGNKEYS } = require("sequelize/lib/query-types");
module.exports = (sequelize, DataTypes) => {
  class Positions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Positions.hasMany(models.Employees, { foreignKey: "position_id" });
    }
  }
  Positions.init(
    {
      name: DataTypes.STRING(30),
      level: DataTypes.STRING(15),
    },
    {
      sequelize,
      modelName: "Positions",
      freezeTableName: true,
    }
  );

  return Positions;
};

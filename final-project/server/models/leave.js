"use strict";
const { Model } = require("sequelize");
// const { FOREIGNKEYS } = require("sequelize/lib/query-types");
module.exports = (sequelize, DataTypes) => {
  class Leaves extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Leaves.belongsTo(models.Employees, { foreignKey: "employee_id" });
    }
  }
  Leaves.init(
    {
      employee_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Employees",
          key: "id",
        },
      },
      leave_type: DataTypes.STRING(15),
      start_date: DataTypes.DATEONLY,
      end_date: DataTypes.DATEONLY,
      reason: DataTypes.TEXT,
      status: DataTypes.STRING(20),
    },
    {
      sequelize,
      modelName: "Leaves",
      freezeTableName: true,
    }
  );

  return Leaves;
};

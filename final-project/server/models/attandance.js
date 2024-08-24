"use strict";
const { Model } = require("sequelize");
// const { FOREIGNKEYS } = require("sequelize/lib/query-types");
module.exports = (sequelize, DataTypes) => {
  class Attandances extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Attandances.belongsTo(models.Employees, { foreignKey: "employee_id" });
    }
  }
  Attandances.init(
    {
      employee_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Employees",
          key: "id",
        },
      },
      date: DataTypes.DATEONLY,
      time_in: DataTypes.DATE,
      time_out: DataTypes.DATE,
      status: DataTypes.STRING(15),
    },
    {
      sequelize,
      modelName: "Attandances",
      freezeTableName: true,
    }
  );

  return Attandances;
};

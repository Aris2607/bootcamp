"use strict";
const { Model } = require("sequelize");
// const { FOREIGNKEYS } = require("sequelize/lib/query-types");
module.exports = (sequelize, DataTypes) => {
  class Notifications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Notifications.init(
    {
      employee_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Employees",
          key: "id",
        },
      },
      title: DataTypes.STRING,
      message: DataTypes.TEXT,
      status: DataTypes.STRING(15),
      read_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Notifications",
      freezeTableName: true,
    }
  );

  return Notifications;
};

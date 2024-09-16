"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Notifications extends Model {
    static associate(models) {
      Notifications.belongsTo(models.Employees, { foreignKey: "employee_id" });
    }
  }

  Notifications.init(
    {
      employee_id: {
        type: DataTypes.INTEGER,
        references: { model: "Employees", key: "id" },
      },
      message: DataTypes.STRING,
      read: { type: DataTypes.BOOLEAN, defaultValue: false },
      created_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Notifications",
      freezeTableName: true,
    }
  );

  return Notifications;
};

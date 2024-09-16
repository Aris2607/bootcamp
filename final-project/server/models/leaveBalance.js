"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class LeaveBalances extends Model {
    static associate(models) {
      LeaveBalances.belongsTo(models.Employees, { foreignKey: "employee_id" });
    }
  }

  LeaveBalances.init(
    {
      employee_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Employees",
          key: "id",
        },
      },
      leave_type: {
        type: DataTypes.ENUM("Annual", "Sick"),
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total_days: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      days_taken: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      balance: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.total_days - this.days_taken;
        },
      },
    },
    {
      sequelize,
      modelName: "LeaveBalances",
      freezeTableName: true,
      timestamps: false,
    }
  );

  return LeaveBalances;
};

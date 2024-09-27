"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ErrorLogs extends Model {
    static associate(models) {
      // Jika ada relasi dengan model lain, bisa ditambahkan di sini
    }
  }

  ErrorLogs.init(
    {
      error_message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      stack_trace: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // jika error terkait dengan pengguna tertentu
      },
      controller: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "ErrorLogs",
      freezeTableName: true,
      timestamps: false, // jika ingin mengelola createdAt dan updatedAt secara manual
    }
  );

  return ErrorLogs;
};

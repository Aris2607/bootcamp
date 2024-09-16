"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Chats extends Model {
    static associate(models) {
      // Define association here
      Chats.belongsTo(models.Users, {
        foreignKey: "user_id",
      });

      Chats.belongsTo(models.Divisions, {
        foreignKey: "division_id",
      });
    }
  }

  Chats.init(
    {
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      division_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Divisions",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Chats",
      freezeTableName: true,
    }
  );

  return Chats;
};

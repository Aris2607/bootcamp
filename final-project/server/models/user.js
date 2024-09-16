"use strict";
const { Model } = require("sequelize");
// const { FOREIGNKEYS } = require("sequelize/lib/query-types");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Users.belongsTo(models.Employees, { foreignKey: "employee_id" });
      Users.belongsTo(models.Roles, { foreignKey: "role_id" });
      Users.hasMany(models.Chats, {
        foreignKey: "user_id",
      });
    }
  }
  Users.init(
    {
      employee_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Employees",
          key: "id",
        },
      },
      username: DataTypes.STRING(20),
      password: DataTypes.STRING(60),
      role_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Roles",
          key: "id",
        },
      },
      status: DataTypes.STRING(10),
    },
    {
      sequelize,
      modelName: "Users",
      freezeTableName: true,
    }
  );

  return Users;
};

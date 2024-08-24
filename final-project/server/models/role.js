"use strict";
const { Model } = require("sequelize");
// const { FOREIGNKEYS } = require("sequelize/lib/query-types");
module.exports = (sequelize, DataTypes) => {
  class Roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Roles.hasMany(models.Users, { foreignKey: "role_id" });
    }
  }
  Roles.init(
    {
      role_name: DataTypes.STRING(15),
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Roles",
      freezeTableName: true,
    }
  );

  return Roles;
};

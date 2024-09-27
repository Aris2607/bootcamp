const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Settings extends Model {}

  Settings.init(
    {
      app_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      logo_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      office_latitude: {
        type: DataTypes.FLOAT, // atau DataTypes.DECIMAL jika Anda memerlukan presisi lebih
        allowNull: true,
      },
      office_longitude: {
        type: DataTypes.FLOAT, // atau DataTypes.DECIMAL jika Anda memerlukan presisi lebih
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Settings",
      timestamps: true,
    }
  );
  return Settings;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SessionsHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //
      // TODO FIX ASSOCIATIONS TO BE HISTORY TABLES
      //
      // SessionsHistory.hasMany(models.Division, { foreignKey: "division_id" });
      // SessionsHistory.hasMany(models.Season, { foreignKey: "season_id" });
      // SessionsHistory.hasMany(models.League, { foreignKey: "league_id" });
    }
  }
  SessionsHistory.init(
    {
      division_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      season_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      league_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "SessionsHistory",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return SessionsHistory;
};

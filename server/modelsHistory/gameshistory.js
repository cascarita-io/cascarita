"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class GamesHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      GamesHistory.belongsTo(models.Session, { foreignKey: "session_id" });
      GamesHistory.belongsTo(models.Team, { foreignKey: "away_team_id" });
      GamesHistory.belongsTo(models.Team, { foreignKey: "home_team_id" });
      GamesHistory.belongsTo(models.GameStatus, {
        foreignKey: "game_status_id",
      });
      GamesHistory.belongsTo(models.Fields, { foreignKey: "field_id" });
      GamesHistory.hasMany(models.User, { foreignKey: "created_by_id" });
      GamesHistory.hasMany(models.User, { foreignKey: "updated_by_id" });
    }
  }
  GamesHistory.init(
    {
      session_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      game_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      game_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      away_team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      away_team_goals: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      home_team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      home_team_goals: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      winner_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      loser_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      draw: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      game_status_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      field_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "GamesHistory",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return GamesHistory;
};

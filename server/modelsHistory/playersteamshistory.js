"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PlayersTeamsHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PlayersTeamsHistory.hasMany(models.TeamsSession, {
        foreignKey: "team_session_id",
      });
      PlayersTeamsHistory.hasMany(models.Players, {
        foreignKey: "player_id",
      });
    }
  }
  PlayersTeamsHistory.init(
    {
      team_session_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      player_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "PlayersTeamsHistory",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return PlayersTeamsHistory;
};

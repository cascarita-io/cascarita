"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PlayersTeamsPerformance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PlayersTeamsPerformance.belongsTo(models.PlayersTeams, {
        foreignKey: "player_team_id",
      });
    }
  }
  PlayersTeamsPerformance.init(
    {
      player_team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      jersey_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      goals: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      assist: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      yellow_cards: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      red_cards: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "PlayersTeamsPerformance",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return PlayersTeamsPerformance;
};

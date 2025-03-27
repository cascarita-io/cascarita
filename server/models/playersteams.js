"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PlayersTeams extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PlayersTeams.belongsTo(models.TeamsSession, {
        foreignKey: "team_session_id",
        targetKey: "id",
      });
      PlayersTeams.hasMany(models.Player, { foreignKey: "player_id" });
    }
  }
  PlayersTeams.init(
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
      modelName: "PlayersTeams",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return PlayersTeams;
};

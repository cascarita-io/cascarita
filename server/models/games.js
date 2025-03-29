"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Games extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Games.belongsTo(models.Session, { foreignKey: "session_id" });
      Games.belongsTo(models.Team, {
        foreignKey: "away_team_id",
        sourceKey: "id",
      });
      Games.belongsTo(models.Team, {
        foreignKey: "home_team_id",
        sourceKey: "id",
      });

      Games.belongsTo(models.GameStatus, { foreignKey: "game_status_id" });
      Games.belongsTo(models.Fields, { foreignKey: "field_id" });

      Games.belongsTo(models.User, {
        foreignKey: "created_by_id",
        targetKey: "id",
      });
      Games.belongsTo(models.User, {
        foreignKey: "updated_by_id",
        targetKey: "id",
      });
    }
  }
  Games.init(
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
      modelName: "Games",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return Games;
};

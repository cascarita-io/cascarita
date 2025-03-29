"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TeamsPerformances extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TeamsPerformances.belongsTo(models.TeamsSession, {
        foreignKey: "team_session_id",
        targetKey: "id",
      });
    }
  }
  TeamsPerformances.init(
    {
      team_session_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      games_played: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      wins: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      losses: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      draws: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      goals_against: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      goals_for: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      goals_differential: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      table_position: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "TeamsPerformances",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return TeamsPerformances;
};

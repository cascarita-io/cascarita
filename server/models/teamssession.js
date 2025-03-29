"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TeamsSession extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TeamsSession.belongsTo(models.Session, {
        foreignKey: "session_id",
        targetKey: "id",
      });

      TeamsSession.belongsTo(models.Team, {
        foreignKey: "team_id",
        targetKey: "id",
      });

      TeamsSession.hasMany(models.PlayersTeams, {
        foreignKey: "team_session_id",
        sourceKey: "id",
      });

      TeamsSession.hasMany(models.TeamsPerformances, {
        foreignKey: "team_session_id",
        sourceKey: "id",
      });
    }
  }
  TeamsSession.init(
    {
      session_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "TeamsSession",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return TeamsSession;
};

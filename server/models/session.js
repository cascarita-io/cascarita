"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Session.belongsTo(models.Season, {
        foreignKey: "season_id",
        targetKey: "id",
      });

      Session.belongsTo(models.Division, {
        foreignKey: "division_id",
        targetKey: "id",
      });

      Session.hasMany(models.TeamsSession, {
        foreignKey: "session_id",
        sourceKey: "id",
      });
    }
  }
  Session.init(
    {
      division_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      season_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Session",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return Session;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TeamsSessionHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TeamsSessionHistory.hasMany(models.Session, { foreignKey: "session_id" });
      TeamsSessionHistory.hasMany(models.Team, { foreignKey: "team_id" });
    }
  }
  TeamsSessionHistory.init(
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
      modelName: "TeamsSessionHistory",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return TeamsSessionHistory;
};

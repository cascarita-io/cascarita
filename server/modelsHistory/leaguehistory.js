"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class LeagueHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      LeagueHistory.belongsTo(models.Group, { foreignKey: "group_id" });
    }
  }
  LeagueHistory.init(
    {
      group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "LeagueHistory",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return LeagueHistory;
};

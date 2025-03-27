"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class League extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      League.belongsTo(models.Group, {
        foreignKey: "group_id",
        targetKey: "id",
      });

      League.hasMany(models.Season, {
        foreignKey: "league_id",
        sourceKey: "id",
      });
    }
  }
  League.init(
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
      modelName: "League",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return League;
};

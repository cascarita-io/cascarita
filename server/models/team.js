"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Team.belongsTo(models.Group, {
        foreignKey: "group_id",
        targetKey: "id",
      });

      Team.hasMany(models.TeamsSession, {
        foreignKey: "team_id",
        sourceKey: "id",
      });

      Team.hasMany(models.Games, {
        foreignKey: "team_id",
        sourceKey: "id",
      });
    }
  }
  Team.init(
    {
      group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "name field is required",
          },
          notEmpty: {
            msg: "name field cannot be empty",
          },
          len: {
            args: [1, 30],
            msg: "name must be between 1 and 30 characters",
          },
        },
      },
      team_logo: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: {
            msg: "team logo field cannot be empty",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Team",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return Team;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserSessions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserSessions.belongsTo(models.User, {
        foreignKey: "user_id",
        targetKey: "id",
      });
      UserSessions.belongsTo(models.Session, {
        foreignKey: "session_id",
        targetKey: "id",
      });
      UserSessions.belongsTo(models.Team, {
        foreignKey: "team_id",
        targetKey: "id",
      });
    }
  }
  UserSessions.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      session_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      team_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "UserSessions",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return UserSessions;
};

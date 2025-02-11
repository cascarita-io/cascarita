"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserRoles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserRoles.belongsTo(models.User, {
        foreignKey: "user_id",
        targetKey: "id",
      });

      UserRoles.belongsTo(models.Role, {
        foreignKey: "role_id",
        targetKey: "id",
      });

      UserRoles.hasMany(models.UserStripeAccounts, {
        foreignKey: "user_role_id",
        sourceKey: "id",
      });
    }
  }
  UserRoles.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "UserRoles",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return UserRoles;
};

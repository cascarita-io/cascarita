"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class RolePermission extends Model {
    static associate(models) {
      RolePermission.belongsTo(models.Role, {
        foreignKey: "role_id",
        onDelete: "CASCADE",
      });
      RolePermission.belongsTo(models.Permission, {
        foreignKey: "permission_id",
        onDelete: "CASCADE",
      });
    }
  }

  RolePermission.init(
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      role_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      permission_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "RolePermission",
      tableName: "RolePermissions",
      timestamps: true,
      underscored: true,
    },
  );

  return RolePermission;
};
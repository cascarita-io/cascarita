'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
      static associate(models) {
        //associations
    }
  }
  Permission.init(
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
          },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Permission',
      tableName: 'Permissions',
      timestamps: true,
      underscored: true,
    }
  );

  return Permission;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Group, {
        foreignKey: "group_id",
        targetKey: "id",
      });
      User.belongsTo(models.Language, {
        foreignKey: "language_id",
        targetKey: "id",
      });
      User.hasMany(models.Form, {
        foreignKey: "created_by",
        sourceKey: "id",
      });
      User.hasMany(models.Form, {
        foreignKey: "updated_by",
        sourceKey: "id",
      });
      User.hasMany(models.Games, {
        foreignKey: "created_by_id",
        sourceKey: "id",
      });
      User.hasMany(models.Games, {
        foreignKey: "updated_by_id",
        sourceKey: "id",
      });
      User.hasMany(models.AuthCode, {
        foreignKey: "user_id",
        sourceKey: "id",
      });
      User.hasMany(models.UserRoles, {
        foreignKey: "user_id",
        sourceKey: "id",
      });
    }
  }
  User.init(
    {
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "first name field is required",
          },
          notEmpty: {
            msg: "first name field cannot be empty",
          },
          len: {
            args: [1, 30],
            msg: "first name must be between 1 and 30 characters",
          },
        },
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "last name field is required",
          },
          notEmpty: {
            msg: "last name field cannot be empty",
          },
          len: {
            args: [1, 30],
            msg: "last name must be between 1 and 30 characters",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notNull: {
            isEmail: true,
            msg: "email field is required",
          },
          notEmpty: {
            msg: "email field cannot be empty",
          },
          len: {
            args: [1, 30],
            msg: "email must be between 1 and 30 characters",
          },
        },
      },
      group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      language_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  return User;
};

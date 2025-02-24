"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.hasMany(models.League, {
        foreignKey: "group_id",
        sourceKey: "id",
      });

      Group.hasMany(models.Division, {
        foreignKey: "group_id",
        sourceKey: "id",
      });

      Group.hasMany(models.Team, {
        foreignKey: "group_id",
        sourceKey: "id",
      });

      Group.hasMany(models.User, {
        foreignKey: "group_id",
        sourceKey: "id",
      });

      Group.hasMany(models.Form, {
        foreignKey: "group_id",
        sourceKey: "id",
      });
    }
  }
  Group.init(
    {
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notNull: {
            msg: "name field is required",
          },
          notEmpty: {
            msg: "name field cannot be empty",
          },
        },
      },
      street_address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "street address field is required",
          },
          notEmpty: {
            msg: "street address field cannot be empty",
          },
          len: {
            args: [5, 100],
            msg: "street address must be between 5 and 100 characters",
          },
        },
      },
      city: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notNull: {
            msg: "city field is required",
          },
          notEmpty: {
            msg: "city field cannot be empty",
          },
          len: {
            args: [2, 50],
            msg: "city name must be between 2 and 50 characters",
          },
        },
      },
      state: {
        type: DataTypes.STRING(2),
        allowNull: false,
        validate: {
          notNull: {
            msg: "state field is required",
          },
          notEmpty: {
            msg: "state field cannot be empty",
          },
          isIn: {
            args: [
              [
                "AL",
                "AK",
                "AZ",
                "AR",
                "CA",
                "CO",
                "CT",
                "DE",
                "FL",
                "GA",
                "HI",
                "ID",
                "IL",
                "IN",
                "IA",
                "KS",
                "KY",
                "LA",
                "ME",
                "MD",
                "MA",
                "MI",
                "MN",
                "MS",
                "MO",
                "MT",
                "NE",
                "NV",
                "NH",
                "NJ",
                "NM",
                "NY",
                "NC",
                "ND",
                "OH",
                "OK",
                "OR",
                "PA",
                "RI",
                "SC",
                "SD",
                "TN",
                "TX",
                "UT",
                "VT",
                "VA",
                "WA",
                "WV",
                "WI",
                "WY",
              ],
            ],
            msg: "Invalid state abbreviation",
          },
        },
      },
      zip_code: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
          notNull: {
            msg: "zip code field is required",
          },
          notEmpty: {
            msg: "zip code field cannot be empty",
          },
          is: {
            args: /^\d{5}(-\d{4})?$/,
            msg: "invalid zip code format",
          },
        },
      },
      logo_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      group_code: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
          notNull: {
            msg: "group code is required",
          },
          notEmpty: {
            msg: "group code cannot be empty",
          },
        },
      }
    },
    {
      sequelize,
      modelName: "Group",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return Group;
};

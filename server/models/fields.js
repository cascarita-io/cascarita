"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Fields extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Fields.belongsTo(models.Group, { foreignKey: "group_id" });
    }
  }
  Fields.init(
    {
      group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 255],
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 255],
        },
      },
      length: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
          isFloat: true,
          min: 0,
        },
      },
      width: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
          isFloat: true,
          min: 0,
        },
      },
    },
    {
      sequelize,
      modelName: "Fields",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return Fields;
};

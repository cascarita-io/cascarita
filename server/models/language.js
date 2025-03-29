"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Language extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Language.hasMany(models.User, {
        foreignKey: "language_id",
        sourceKey: "id",
      });
    }
  }
  Language.init(
    {
      language: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Language",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return Language;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class InternalPaymentStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  InternalPaymentStatus.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "InternalPaymentStatus",
      tableName: "InternalPaymentStatuses",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return InternalPaymentStatus;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FieldsHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FieldsHistory.belongsTo(models.Group, { foreignKey: "group_id" });
    }
  }
  FieldsHistory.init(
    {
      group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      length: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      width: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "FieldsHistory",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return FieldsHistory;
};

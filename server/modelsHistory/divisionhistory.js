"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DivisionHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DivisionHistory.belongsTo(models.Group, { foreignKey: "group_id" });
    }
  }
  DivisionHistory.init(
    {
      group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "DivisionHistory",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return DivisionHistory;
};

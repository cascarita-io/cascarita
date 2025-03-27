"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SeasonHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SeasonHistory.belongsTo(models.Group, { foreignKey: "group_id" });
    }
  }
  SeasonHistory.init(
    {
      group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "SeasonHistory",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return SeasonHistory;
};

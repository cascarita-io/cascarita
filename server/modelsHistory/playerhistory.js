"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PlayerHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PlayerHistory.belongsTo(models.Group, { foreignKey: "group_id" });
    }
  }
  PlayerHistory.init(
    {
      group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profile_picture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      date_of_birth: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "PlayerHistory",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return PlayerHistory;
};

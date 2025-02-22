"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserStripeAccounts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserStripeAccounts.belongsTo(models.User, {
        foreignKey: "user_id",
        targetKey: "id",
      });
      UserStripeAccounts.belongsTo(models.StripeStatus, {
        foreignKey: "stripe_status_id",
        targetKey: "id",
      });
      UserStripeAccounts.belongsTo(models.FormPayment, {
        foreignKey: "user_stripe_account_id",
        targetKey: "id",
      });
    }
  }
  UserStripeAccounts.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      stripe_account_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      stripe_account_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      platform_account_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      platform_account_description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      account_email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      support_email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      details_submitted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      requires_verification: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      charges_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      payouts_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      stripe_status_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "UserStripeAccounts",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return UserStripeAccounts;
};

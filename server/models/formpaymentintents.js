"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FormPaymentIntents extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      FormPaymentIntents.belongsTo(models.UserStripeAccounts, {
        foreignKey: "user_stripe_account_id",
        targetKey: "id",
      });
      FormPaymentIntents.belongsTo(models.Form, {
        foreignKey: "form_id",
        targetKey: "id",
      });
    }
  }
  FormPaymentIntents.init(
    {
      payment_intent_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      form_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_stripe_account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      stripe_pi_status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "FormPaymentIntents",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return FormPaymentIntents;
};

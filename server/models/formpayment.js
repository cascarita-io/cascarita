"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FormPayment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      FormPayment.belongsTo(models.Form, {
        foreignKey: "form_id",
        targetKey: "id",
      });

      FormPayment.belongsTo(models.User, {
        foreignKey: "internal_status_updated_by",
        targetKey: "id",
      });

      FormPayment.belongsTo(models.User, {
        foreignKey: "collected_by",
        targetKey: "id",
      });

      FormPayment.belongsTo(models.PaymentMethod, {
        foreignKey: "payment_method_id",
        targetKey: "id",
      });

      FormPayment.belongsTo(models.InternalPaymentStatus, {
        foreignKey: "internal_status_id",
        targetKey: "id",
      });
    }
  }
  FormPayment.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      form_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      payment_method_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      internal_status_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1, // 'pending'
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      payment_intent_id: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      internal_status_updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          isDate: true,
          isBefore: new Date().toString(),
        },
      },
      internal_status_updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      payment_intent_status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      collected_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },

    {
      sequelize,
      modelName: "FormPayment",
      tableName: "FormPayments",
    },
  );
  return FormPayment;
};

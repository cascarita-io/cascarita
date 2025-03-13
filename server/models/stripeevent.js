"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class StripeEvent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StripeEvent.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      event_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      event_type: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("received", "processing", "completed", "failed"),
        allowNull: false,
        defaultValue: "received",
      },
      payload: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      result: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      error_message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      livemode: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      received_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      processed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "StripeEvent",
      tableName: "StripeEvents",
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          name: "idx_stripe_events_event_id",
          fields: ["event_id"],
        },
        {
          name: "idx_stripe_events_status",
          fields: ["status"],
        },
        {
          name: "idx_stripe_events_event_type",
          fields: ["event_type"],
        },
        {
          name: "idx_stripe_events_livemode",
          fields: ["livemode"],
        },
      ],
    },
  );
  return StripeEvent;
};

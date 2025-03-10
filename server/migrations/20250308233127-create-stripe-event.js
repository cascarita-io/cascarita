"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("StripeEvents", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      event_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      event_type: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("received", "processing", "completed", "failed"),
        allowNull: false,
        defaultValue: "received",
      },
      payload: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      result: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      error_message: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      livemode: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      received_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      processed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex("StripeEvents", ["event_id"], {
      name: "idx_stripe_events_event_id",
    });
    await queryInterface.addIndex("StripeEvents", ["status"], {
      name: "idx_stripe_events_status",
    });
    await queryInterface.addIndex("StripeEvents", ["event_type"], {
      name: "idx_stripe_events_event_type",
    });
    await queryInterface.addIndex("StripeEvents", ["livemode"], {
      name: "idx_stripe_events_livemode",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("StripeEvents");
  },
};

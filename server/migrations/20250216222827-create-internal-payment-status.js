"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable(
        "InternalPaymentStatuses",
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          code: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
          },
          description: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          created_at: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updated_at: {
            allowNull: false,
            type: Sequelize.DATE,
          },
        },
        { transaction },
      );

      await queryInterface.bulkInsert(
        "InternalPaymentStatuses",
        [
          {
            code: "pending",
            name: "Pending",
            description: "Payment has been initiated but not yet processed",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            code: "awaiting_approval",
            name: "Awaiting Approval",
            description: "Payment requires admin review before processing",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            code: "approved",
            name: "Approved",
            description: "Payment has been approved by admin",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            code: "declined",
            name: "Declined",
            description: "Payment was declined by admin",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            code: "processing",
            name: "Processing",
            description:
              "Payment is being processed (e.g., capturing Stripe payment)",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            code: "completed",
            name: "Completed",
            description: "Payment has been successfully completed",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            code: "failed",
            name: "Failed",
            description:
              "Payment failed due to technical or payment provider issues",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            code: "refund_pending",
            name: "Refund Pending",
            description: "Refund has been initiated but not yet processed",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            code: "refund_processing",
            name: "Refund Processing",
            description: "Refund is being processed with payment provider",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            code: "refunded",
            name: "Refunded",
            description: "Payment has been successfully refunded",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            code: "cancelled",
            name: "Cancelled",
            description: "Payment was cancelled before processing",
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction },
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("InternalPaymentStatuses");
  },
};

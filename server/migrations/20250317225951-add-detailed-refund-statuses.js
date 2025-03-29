"use strict";

"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.bulkInsert(
        "InternalPaymentStatuses",
        [
          {
            code: "refund_requires_action",
            name: "Refund Requires Action",
            description: "Refund requires additional action to be completed",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            code: "refund_failed",
            name: "Refund Failed",
            description: "Refund attempt failed",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            code: "refund_canceled",
            name: "Refund Canceled",
            description: "Refund has been canceled",
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction },
      );

      await queryInterface.bulkDelete(
        "InternalPaymentStatuses",
        {
          code: "refund_processing",
        },
        { transaction },
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.bulkDelete(
        "InternalPaymentStatuses",
        {
          code: {
            [Sequelize.Op.in]: [
              "refund_requires_action",
              "refund_canceled",
              "refund_failed",
            ],
          },
        },
        { transaction },
      );

      await queryInterface.bulkInsert(
        "InternalPaymentStatuses",
        [
          {
            code: "refund_processing",
            name: "Refund Processing",
            description: "Refund is being processed with payment provider",
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
};

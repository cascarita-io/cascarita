"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await Promise.all([
        queryInterface.addColumn("FormPaymentIntents", "stripe_pi_status", {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: null,
          transaction,
        }),

        queryInterface.addColumn("FormPaymentIntents", "expires_at", {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal(
            "(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 4 DAY))",
          ),
          transaction,
        }),
      ]);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("FormPaymentIntents", "stripe_pi_status");
    await queryInterface.removeColumn("FormPaymentIntents", "expires_at");
  },
};

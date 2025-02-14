"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.addColumn("FormPaymentIntents", "stripe_pi_status", {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
        transaction,
      });

      await queryInterface.addColumn("FormPaymentIntents", "expires_at", {
        // set it to null when payment.intent has not been completed
        type: Sequelize.DATE,
        allowNull: true,
        transaction,
      });

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

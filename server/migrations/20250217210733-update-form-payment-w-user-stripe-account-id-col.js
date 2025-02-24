"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.addColumn(
        "FormPayments",
        "user_stripe_account_id",
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "UserStripeAccounts",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
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
    await queryInterface.removeColumn("FormPayments", "user_stripe_account_id");
  },
};

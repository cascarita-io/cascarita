"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.addConstraint(
        "UserStripeAccounts",
        {
          fields: ["stripe_account_id"],
          type: "unique",
          name: "unique_stripe_account_id",
        },
        { transaction },
      );

      await queryInterface.removeColumn(
        "FormPayments",
        "user_stripe_account_id",
        {
          transaction,
        },
      );

      await queryInterface.addColumn(
        "FormPayments",
        "stripe_account_id_string",
        {
          type: Sequelize.STRING,
          allowNull: true,
          references: {
            model: "UserStripeAccounts",
            key: "stripe_account_id",
          },
          onUpdate: "CASCADE",
          onDelete: "NO ACTION",
        },
        { transaction },
      );

      await queryInterface.addColumn("FormPayments", "payer_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.removeColumn("FormPayments", "payer_id", {
        transaction,
      });

      await queryInterface.removeColumn(
        "FormPayments",
        "stripe_account_id_string",
        {
          transaction,
        },
      );

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

      await queryInterface.removeConstraint(
        "UserStripeAccounts",
        "unique_stripe_account_id",
        { transaction },
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};

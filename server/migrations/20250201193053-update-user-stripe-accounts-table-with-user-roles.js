"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.removeColumn("UserStripeAccounts", "user_id", {
        transaction,
      });

      await queryInterface.addColumn("UserStripeAccounts", "user_role_id", {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "UserRoles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
      await queryInterface.removeColumn("UserStripeAccounts", "user_role_id", {
        transaction,
      });

      await queryInterface.addColumn("UserStripeAccounts", "user_id", {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        transaction,
      });
    } catch (error) {
      throw error;
    }
  },
};

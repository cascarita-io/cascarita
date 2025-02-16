"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable(
        "PaymentMethods",
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
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
        "PaymentMethods",
        [
          {
            name: "Stripe",
            description: "Use stripe payment intent to accept card payment",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            name: "Cash",
            description: "this option is for users handing cash to admin ",
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction },
      );
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("PaymentMethods");
  },
};

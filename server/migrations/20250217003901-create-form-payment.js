"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable(
        "FormPayments",
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.BIGINT,
          },
          form_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
              model: "Forms",
              key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
          },
          payment_method_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
              model: "PaymentMethods",
              key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
          internal_status_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: "InternalPaymentStatuses",
              key: "id",
            },
            defaultValue: 1, // 'pending'
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
          amount: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          payment_intent_id: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true,
          },
          internal_status_updated_at: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          internal_status_updated_by: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
              model: "Users",
              key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
          },
          payment_intent_status: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          collected_by: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
              model: "Users",
              key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
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

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("FormPayments");
  },
};

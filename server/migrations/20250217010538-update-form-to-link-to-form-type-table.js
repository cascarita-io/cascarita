"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Forms", "form_type", {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: "FormTypes",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Forms", "form_type");
  },
};

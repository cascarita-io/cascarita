"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Sessions", "league_id");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("Sessions", "league_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Leagues",
        key: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    });
  },
};

"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("UserSessions", "team_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Teams",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("UserSessions", "team_id");
  },
};

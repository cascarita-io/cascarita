"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "address", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.addColumn("Users", "date_of_birth", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn("Users", "phone_number", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.addColumn("Users", "internally_created", {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "address");

    await queryInterface.removeColumn("Users", "date_of_birth");

    await queryInterface.removeColumn("Users", "phone_number");

    await queryInterface.removeColumn("Users", "internally_created");
  },
};

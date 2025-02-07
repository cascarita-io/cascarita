'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint("UserRoles", {
      fields: ["user_id", "role_id"],
      type: "unique",
      name: "unique_user_role",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("UserRoles", "UserRoles_ibfk_1");
    await queryInterface.removeConstraint("UserRoles", "UserRoles_ibfk_2");

    await queryInterface.removeConstraint("UserRoles", "unique_user_role");
  }
};

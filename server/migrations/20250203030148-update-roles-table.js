'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    // update role_type to name column
    await queryInterface.renameColumn("Roles", "role_type", "name");
    await queryInterface.changeColumn("Roles", "name", {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true,
    });

    // Add description column
    await queryInterface.addColumn("Roles", "description", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.changeColumn("Roles", "created_at", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });

    await queryInterface.changeColumn("Roles", "updated_at", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });
  },

  async down (queryInterface, Sequelize) {
    // Rename name back to role_type
    await queryInterface.renameColumn("Roles", "name", "role_type");

    // Revert role_type column changes
    await queryInterface.changeColumn("Roles", "role_type", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });

    // Remove description column
    await queryInterface.removeColumn("Roles", "description");

    // Revert createdAt column changes
    await queryInterface.changeColumn("Roles", "created_at", {
      type: Sequelize.DATE,
      allowNull: false,
    });

    // Revert updatedAt column changes
    await queryInterface.changeColumn("Roles", "updated_at", {
      type: Sequelize.DATE,
      allowNull: false,
    });
  }
};

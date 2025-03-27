"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Groups", "group_code", {
      type: Sequelize.STRING(10),
      allowNull: true, // temporary to allow migration
      unique: true,
    });

    await queryInterface.sequelize.query(`
      UPDATE \`Groups\`
      SET group_code = LPAD(HEX(id), 8, '0')
      WHERE group_code IS NULL
    `);

    await queryInterface.changeColumn("Groups", "group_code", {
      type: Sequelize.STRING(10),
      allowNull: false, // Now set to NOT NULL
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Groups", "group_code");
  },
};

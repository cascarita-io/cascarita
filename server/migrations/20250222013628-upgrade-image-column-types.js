'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'picture', {
      type: Sequelize.STRING(2083),
      allowNull: true
    });

    await queryInterface.changeColumn('Teams', 'team_logo', {
      type: Sequelize.STRING(2083),
      allowNull: true
    });

    await queryInterface.changeColumn('TeamHistories', 'team_logo', {
      type: Sequelize.STRING(2083),
      allowNull: true
    });

    await queryInterface.changeColumn('Groups', 'logo_url', {
      type: Sequelize.STRING(2083),
      allowNull: true
    });

    await queryInterface.changeColumn('Players', 'profile_picture', {
      type: Sequelize.STRING(2083),
      allowNull: true
    });

    await queryInterface.changeColumn('PlayerHistories', 'profile_picture', {
      type: Sequelize.STRING(2083),
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'picture', {
      type: Sequelize.STRING(255),
      allowNull: true
    });

    await queryInterface.changeColumn('Teams', 'team_logo', {
      type: Sequelize.STRING(255),
      allowNull: true
    });

    await queryInterface.changeColumn('TeamHistories', 'team_logo', {
      type: Sequelize.STRING(255),
      allowNull: true
    });

    await queryInterface.changeColumn('Groups', 'logo_url', {
      type: Sequelize.STRING(255),
      allowNull: true
    });

    await queryInterface.changeColumn('Players', 'profile_picture', {
      type: Sequelize.STRING(255),
      allowNull: true
    });

    await queryInterface.changeColumn('PlayerHistories', 'profile_picture', {
      type: Sequelize.STRING(255),
      allowNull: true
    });
  }
};

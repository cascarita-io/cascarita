"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn("Groups", "street_address", {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [5, 100],
        },
        transaction,
      });

      await queryInterface.addColumn("Groups", "city", {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
          len: [2, 50],
        },
        transaction,
      });

      await queryInterface.addColumn("Groups", "state", {
        type: Sequelize.STRING(2),
        allowNull: false,
        validate: {
          isIn: [
            [
              "AL",
              "AK",
              "AZ",
              "AR",
              "CA",
              "CO",
              "CT",
              "DE",
              "FL",
              "GA",
              "HI",
              "ID",
              "IL",
              "IN",
              "IA",
              "KS",
              "KY",
              "LA",
              "ME",
              "MD",
              "MA",
              "MI",
              "MN",
              "MS",
              "MO",
              "MT",
              "NE",
              "NV",
              "NH",
              "NJ",
              "NM",
              "NY",
              "NC",
              "ND",
              "OH",
              "OK",
              "OR",
              "PA",
              "RI",
              "SC",
              "SD",
              "TN",
              "TX",
              "UT",
              "VT",
              "VA",
              "WA",
              "WV",
              "WI",
              "WY",
            ],
          ],
        },
        transaction,
      });

      await queryInterface.addColumn("Groups", "zip_code", {
        type: Sequelize.STRING(10),
        allowNull: false,
        validate: {
          is: /^\d{5}(-\d{4})?$/,
        },
        transaction,
      });

      await queryInterface.addColumn("Groups", "logo_url", {
        type: Sequelize.STRING,
        allowNull: true,
        transaction,
      });

      await queryInterface.bulkUpdate(
        "Groups",
        {
          street_address: "123 Main St",
          city: "Watsonville",
          state: "CA",
          zip_code: "95076",
          logo_url: "https://example.com/logo",
        },
        null,
        { transaction },
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.removeColumn("Groups", "street_address", {
        transaction,
      });
      await queryInterface.removeColumn("Groups", "city", { transaction });
      await queryInterface.removeColumn("Groups", "state", { transaction });
      await queryInterface.removeColumn("Groups", "zip_code", { transaction });
      await queryInterface.removeColumn("Groups", "logo_url", { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};

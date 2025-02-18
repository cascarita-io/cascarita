"use strict";
const { User, Language, UserStripeAccounts } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      const group = await queryInterface.bulkInsert(
        "Groups",
        [
          {
            name: "Soccer Central V2",
            street_address: "34 Harkins Slough Rd",
            city: "Watsonville",
            state: "CA",
            zip_code: "95076",
            logo_url: "https://example.com/logo",
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction },
      );

      const language = await Language.findOne({
        where: {
          language: "English",
        },
      });

      const newUser = await User.create(
        {
          first_name: "Raul",
          last_name: "Tester",
          email: "info.cascarita@gmail.com",
          group_id: group,
          role_id: 1, // admin
          language_id: language.id,
          created_at: new Date(),
          updated_at: new Date(),
        },
        { transaction },
      );

      await UserStripeAccounts.create(
        {
          user_id: newUser.id,
          stripe_account_id: "acct_1Pwrm0R4osRmT1sy",
          details_submitted: false,
          requires_verification: true,
          charges_enabled: false,
          payouts_enabled: false,
          stripe_status_id: 4, // 'Enabled'
        },
        { transaction },
      );

      await transaction.commit();
    } catch (err) {
      console.error("Error creating data:", err);
      await transaction.rollback();
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("UserStripeAccounts", {
      stripe_account_id: "acct_1Pwrm0R4osRmT1sy",
    });

    await queryInterface.bulkDelete("Users", {
      email: "info.cascarita@gmail.com",
    });

    await queryInterface.bulkDelete("Groups", {
      name: "Soccer Central",
    });

    await queryInterface.bulkDelete("Roles", { role_type: "League Owner" });
  },
};

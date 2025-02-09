"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const t = await queryInterface.sequelize.transaction();

    try {
      const currentDate = new Date();

      const groups = await queryInterface.bulkInsert(
        "Groups",
        [
          {
            name: "Tech Innovators Group",
            created_at: currentDate,
            updated_at: currentDate,
            street_address: "123 Innovation Drive",
            city: "San Francisco",
            state: "CA",
            zip_code: "94105",
            logo_url: null,
          },
          {
            name: "Green Valley Community Association",
            created_at: currentDate,
            updated_at: currentDate,
            street_address: "456 Meadow Lane",
            city: "Portland",
            state: "OR",
            zip_code: "97201",
            logo_url: null,
          },
          {
            name: "Downtown Business Alliance",
            created_at: currentDate,
            updated_at: currentDate,
            street_address: "789 Main Street",
            city: "Chicago",
            state: "IL",
            zip_code: "60601",
            logo_url: null,
          },
        ],
        { transaction: t },
      );

      const insertedGroups = await queryInterface.sequelize.query(
        `SELECT id, name FROM \`Groups\` WHERE name IN (
          'Tech Innovators Group',
          'Green Valley Community Association',
          'Downtown Business Alliance'
        ) ORDER BY created_at DESC LIMIT 3;`,
        { transaction: t },
      );

      const groupsMap = {};
      insertedGroups[0].forEach((group) => {
        groupsMap[group.name] = group.id;
      });

      const usersData = [
        {
          first_name: "Sarah",
          last_name: "Chen",
          email: "sarah.chen@techinnovators.com",
          group_id: groupsMap["Tech Innovators Group"],
          created_at: currentDate,
          updated_at: currentDate,
          language_id: 1,
          picture: null,
        },
        {
          first_name: "Michael",
          last_name: "Greene",
          email: "michael.g@greenvalley.org",
          group_id: groupsMap["Green Valley Community Association"],
          created_at: currentDate,
          updated_at: currentDate,
          language_id: 1,
          picture: null,
        },
        {
          first_name: "Jessica",
          last_name: "Thompson",
          email: "j.thompson@downtown-alliance.com",
          group_id: groupsMap["Downtown Business Alliance"],
          created_at: currentDate,
          updated_at: currentDate,
          language_id: 1,
          picture: null,
        },
      ];

      const users = await queryInterface.bulkInsert("Users", usersData, {
        transaction: t,
      });

      const insertedUsers = await queryInterface.sequelize.query(
        `SELECT id, email FROM \`Users\` WHERE email IN (
          'sarah.chen@techinnovators.com',
          'michael.g@greenvalley.org',
          'j.thompson@downtown-alliance.com'
        ) ORDER BY created_at DESC LIMIT 3;`,
        { transaction: t },
      );

      const usersMap = {};
      insertedUsers[0].forEach((user) => {
        usersMap[user.email] = user.id;
      });

      const userRoles = await queryInterface.bulkInsert(
        "UserRoles",
        [
          {
            user_id: usersMap["sarah.chen@techinnovators.com"],
            role_id: 1,
            created_at: currentDate,
            updated_at: currentDate,
          },
          {
            user_id: usersMap["michael.g@greenvalley.org"],
            role_id: 1,
            created_at: currentDate,
            updated_at: currentDate,
          },
          {
            user_id: usersMap["j.thompson@downtown-alliance.com"],
            role_id: 1,
            created_at: currentDate,
            updated_at: currentDate,
          },
        ],
        { transaction: t },
      );

      const insertedUserRoles = await queryInterface.sequelize.query(
        `SELECT ur.id, u.email
         FROM \`UserRoles\` ur
         JOIN \`Users\` u ON ur.user_id = u.id
         WHERE u.email IN (
          'sarah.chen@techinnovators.com',
          'michael.g@greenvalley.org',
          'j.thompson@downtown-alliance.com'
         ) ORDER BY ur.created_at DESC LIMIT 3;`,
        { transaction: t },
      );

      const userRolesMap = {};
      insertedUserRoles[0].forEach((userRole) => {
        userRolesMap[userRole.email] = userRole.id;
      });

      await queryInterface.bulkInsert(
        "UserStripeAccounts",
        [
          {
            stripe_account_id: "acct_tech_1",
            created_at: currentDate,
            updated_at: currentDate,
            stripe_account_name: "Tech Innovators Stripe",
            platform_account_name: "Tech Innovators Platform",
            platform_account_description:
              "Tech Innovators Group Payment Processing",
            account_email: "sarah.chen@techinnovators.com",
            support_email: "support@techinnovators.com",
            details_submitted: true,
            requires_verification: false,
            charges_enabled: true,
            payouts_enabled: true,
            stripe_status_id: 5,
            user_role_id: userRolesMap["sarah.chen@techinnovators.com"],
          },
          {
            stripe_account_id: "acct_green_2",
            created_at: currentDate,
            updated_at: currentDate,
            stripe_account_name: "Green Valley Stripe",
            platform_account_name: "Green Valley Platform",
            platform_account_description:
              "Green Valley Association Payment Processing",
            account_email: "michael.g@greenvalley.org",
            support_email: "support@greenvalley.org",
            details_submitted: true,
            requires_verification: false,
            charges_enabled: true,
            payouts_enabled: true,
            stripe_status_id: 5,
            user_role_id: userRolesMap["michael.g@greenvalley.org"],
          },
          {
            stripe_account_id: "acct_downtown_3",
            created_at: currentDate,
            updated_at: currentDate,
            stripe_account_name: "Downtown Alliance Stripe",
            platform_account_name: "Downtown Alliance Platform",
            platform_account_description:
              "Downtown Business Alliance Payment Processing",
            account_email: "j.thompson@downtown-alliance.com",
            support_email: "support@downtown-alliance.com",
            details_submitted: true,
            requires_verification: false,
            charges_enabled: true,
            payouts_enabled: true,
            stripe_status_id: 5,
            user_role_id: userRolesMap["j.thompson@downtown-alliance.com"],
          },
        ],
        { transaction: t },
      );

      await t.commit();
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const t = await queryInterface.sequelize.transaction();

    try {
      const testEmails = [
        "sarah.chen@techinnovators.com",
        "michael.g@greenvalley.org",
        "j.thompson@downtown-alliance.com",
      ];

      const userInfo = await queryInterface.sequelize.query(
        `SELECT u.id as user_id, ur.id as user_role_id
         FROM \`Users\` u
         LEFT JOIN \`UserRoles\` ur ON u.id = ur.user_id
         WHERE u.email IN (:emails)`,
        {
          replacements: { emails: testEmails },
          type: Sequelize.QueryTypes.SELECT,
          transaction: t,
        },
      );

      await queryInterface.bulkDelete(
        "UserStripeAccounts",
        {
          user_role_id: {
            [Sequelize.Op.in]: userInfo
              .map((info) => info.user_role_id)
              .filter(Boolean),
          },
        },
        { transaction: t },
      );

      await queryInterface.bulkDelete(
        "UserRoles",
        {
          user_id: {
            [Sequelize.Op.in]: userInfo.map((info) => info.user_id),
          },
        },
        { transaction: t },
      );

      await queryInterface.bulkDelete(
        "Users",
        {
          email: {
            [Sequelize.Op.in]: testEmails,
          },
        },
        { transaction: t },
      );

      await queryInterface.bulkDelete(
        "Groups",
        {
          name: {
            [Sequelize.Op.in]: [
              "Tech Innovators Group",
              "Green Valley Community Association",
              "Downtown Business Alliance",
            ],
          },
        },
        { transaction: t },
      );

      await t.commit();
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },
};

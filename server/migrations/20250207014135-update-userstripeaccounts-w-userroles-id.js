"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.removeColumn("UserStripeAccounts", "user_id", {
        transaction,
      });

      await queryInterface.addColumn(
        "UserStripeAccounts",
        "user_role_id",
        {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
            model: "UserRoles",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
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
      const stripeAccounts = await queryInterface.sequelize.query(
        `SELECT id, user_role_id FROM \`UserStripeAccounts\``,
        { transaction },
      );

      let accountsArr = stripeAccounts[0];
      const hasStripeAccounts = accountsArr.length > 0;

      await queryInterface.addColumn(
        "UserStripeAccounts",
        "user_id",
        {
          allowNull: hasStripeAccounts,
          type: Sequelize.INTEGER,
          references: {
            model: "Users",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        { transaction },
      );

      if (hasStripeAccounts) {
        const userRoleIds = accountsArr.map((act) => act.user_role_id);

        const users = await queryInterface.sequelize.query(
          `SELECT id, user_id FROM \`UserRoles\` WHERE id IN (:userRoleIds)`,
          {
            replacements: { userRoleIds },
            transaction,
          },
        );

        const userRoleMap = users[0].reduce((map, user) => {
          map[user.id] = user.user_id;
          return map;
        }, {});

        accountsArr.forEach((account) => {
          account.user_id = userRoleMap[account.user_role_id];
        });

        for (const account of accountsArr) {
          await queryInterface.sequelize.query(
            `UPDATE \`UserStripeAccounts\` SET user_id = ? WHERE id = ?`,
            {
              replacements: [account.user_id, account.id],
              transaction,
            },
          );
        }

        await queryInterface.changeColumn(
          "UserStripeAccounts",
          "user_id",
          {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: "Users",
              key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
          { transaction },
        );
      }

      await queryInterface.removeColumn("UserStripeAccounts", "user_role_id", {
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};

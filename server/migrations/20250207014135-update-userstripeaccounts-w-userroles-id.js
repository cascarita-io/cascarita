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
        `SELECT id, user_role_id FROM UserStripeAccounts`,
        { transaction },
      );

      // If we have existing accounts, we need to preserve the relationships
      if (stripeAccounts[0].length > 0) {
        const userRoles = await queryInterface.sequelize.query(
          `SELECT id, user_id FROM "UserRoles" WHERE id IN (?)`,
          {
            replacements: [
              stripeAccounts[0].map((account) => account.user_role_id),
            ],
            transaction,
          },
        );

        const roleToUserMapping = userRoles[0].reduce((acc, role) => {
          acc[role.id] = role.user_id;
          return acc;
        }, {});

        await queryInterface.addColumn(
          "UserStripeAccounts",
          "user_id",
          {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          { transaction },
        );

        for (const account of stripeAccounts[0]) {
          const userId = roleToUserMapping[account.user_role_id];
          if (!userId) {
            throw new Error(
              `No user_id found for user_role_id: ${account.user_role_id}. ` +
                `This could mean the UserRole was deleted. ` +
                `Migration cannot proceed safely.`,
            );
          }

          await queryInterface.sequelize.query(
            `UPDATE "UserStripeAccounts" SET user_id = ? WHERE id = ?`,
            {
              replacements: [userId, account.id],
              transaction,
            },
          );
        }

        await queryInterface.removeColumn(
          "UserStripeAccounts",
          "user_role_id",
          {
            transaction,
          },
        );

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
      } else {
        // If no data exists, we can do a simple rollback
        await queryInterface.removeColumn(
          "UserStripeAccounts",
          "user_role_id",
          {
            transaction,
          },
        );

        await queryInterface.addColumn(
          "UserStripeAccounts",
          "user_id",
          {
            allowNull: false,
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
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};

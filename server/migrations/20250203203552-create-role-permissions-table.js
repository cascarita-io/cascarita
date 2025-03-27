"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("RolePermissions", {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      permission_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        ),
      },
    });

    await queryInterface.addConstraint("RolePermissions", {
      fields: ["role_id"],
      type: "foreign key",
      name: "fk_rolepermissions_role_id",
      references: {
        table: "Roles",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("RolePermissions", {
      fields: ["permission_id"],
      type: "foreign key",
      name: "fk_rolepermissions_permission_id",
      references: {
        table: "Permissions",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("RolePermissions", {
      fields: ["role_id", "permission_id"],
      type: "unique",
      name: "unique_role_permission",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "RolePermissions",
      "fk_rolepermissions_role_id",
    );
    await queryInterface.removeConstraint(
      "RolePermissions",
      "fk_rolepermissions_permission_id",
    );
    await queryInterface.removeConstraint(
      "RolePermissions",
      "unique_role_permission",
    );

    await queryInterface.dropTable("RolePermissions");
  },
};

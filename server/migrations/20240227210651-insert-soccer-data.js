"use strict";
const fs = require("fs");
const path = require("path");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const t = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.bulkInsert(
        "Groups",
        [
          {
            name: "The FA (Football Federation)",
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction: t },
      );

      const groups = await queryInterface.sequelize.query(
        "SELECT id FROM `Groups` WHERE name = ?",
        {
          replacements: ["The FA (Football Federation)"],
          type: Sequelize.QueryTypes.SELECT,
          transaction: t,
        },
      );

      const groupId = groups[0].id;

      await queryInterface.bulkInsert(
        "Divisions",
        [
          {
            name: "First Team",
            group_id: groupId,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction: t },
      );
      const divisions = await queryInterface.sequelize.query(
        "SELECT id FROM `Divisions` WHERE group_id = ?",
        {
          replacements: [groupId],
          type: Sequelize.QueryTypes.SELECT,
          transaction: t,
        },
      );

      const divisionId = divisions[0].id;

      await queryInterface.bulkInsert(
        "Seasons",
        [
          {
            name: "2015/16",
            start_date: new Date(),
            end_date: new Date(),
            is_active: true,
            group_id: groupId,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction: t },
      );

      const seasons = await queryInterface.sequelize.query(
        "SELECT id FROM `Seasons` WHERE group_id = ?",
        {
          replacements: [groupId],
          type: Sequelize.QueryTypes.SELECT,
          transaction: t,
        },
      );

      const seasonId = seasons[0].id;

      await queryInterface.bulkInsert(
        "Leagues",
        [
          {
            name: "Premier League",
            group_id: groupId,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction: t },
      );

      const leagues = await queryInterface.sequelize.query(
        "SELECT id FROM `Leagues` WHERE group_id = ?",
        {
          replacements: [groupId],
          type: Sequelize.QueryTypes.SELECT,
          transaction: t,
        },
      );

      const leagueId = leagues[0].id;

      await queryInterface.bulkInsert(
        "Sessions",
        [
          {
            division_id: divisionId,
            season_id: seasonId,
            league_id: leagueId,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction: t },
      );

      await queryInterface.bulkInsert(
        "Roles",
        [
          {
            role_type: "Staff",
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction: t },
      );

      const roles = await queryInterface.sequelize.query(
        "SELECT id FROM `Roles` WHERE role_type = ?",
        {
          replacements: ["Staff"],
          type: Sequelize.QueryTypes.SELECT,
          transaction: t,
        },
      );

      const roleId = roles[0].id;

      await queryInterface.bulkInsert(
        "Users",
        [
          {
            first_name: "Saul",
            last_name: "Messi",
            email: "supercoolsaul@cool.com",
            password: "saul",
            group_id: groupId,
            role_id: roleId,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction: t },
      );

      await queryInterface.bulkInsert(
        "Fields",
        [
          {
            group_id: groupId,
            name: "Wembly",
            address: "Wembly St.",
            length: 100.0,
            width: 50.0,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction: t },
      );

      await queryInterface.bulkInsert(
        "GameStatuses",
        [
          {
            status: "Completed",
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction: t },
      );

      const imageURL = "fake.url.com";

      const users = await queryInterface.sequelize.query(
        "SELECT id FROM `Users` WHERE first_name = ?",
        {
          replacements: ["Saul"],
          type: Sequelize.QueryTypes.SELECT,
          transaction: t,
        },
      );

      const userId = users[0].id;

      const statuses = await queryInterface.sequelize.query(
        "SELECT id FROM `GameStatuses` WHERE status = ?",
        {
          replacements: ["Completed"],
          type: Sequelize.QueryTypes.SELECT,
          transaction: t,
        },
      );

      const statusId = statuses[0].id;

      const fields = await queryInterface.sequelize.query(
        "SELECT id FROM `Fields` WHERE name = ?",
        {
          replacements: ["Wembly"],
          type: Sequelize.QueryTypes.SELECT,
          transaction: t,
        },
      );

      const fieldsId = fields[0].id;

      const gameStatuses = await queryInterface.sequelize.query(
        "SELECT id FROM `GameStatuses` WHERE status = ?",
        {
          replacements: ["Completed"],
          type: Sequelize.QueryTypes.SELECT,
          transaction: t,
        },
      );

      const gameStatusesID = gameStatuses[0].id;

      const sessions = await queryInterface.sequelize.query(
        "SELECT id FROM `Sessions` WHERE division_id = ?",
        {
          replacements: [divisionId],
          type: Sequelize.QueryTypes.SELECT,
          transaction: t,
        },
      );

      const sessionsId = sessions[0].id;

      const teamsFilePath = path.join(
        __dirname,
        "..",
        "mockData",
        "england",
        "premier-league-team-2015-file.json",
      );

      const gamesFilePath = path.join(
        __dirname,
        "..",
        "mockData",
        "england",
        "premier-league-game-2015-file.json",
      );

      let teamsString = fs.readFileSync(teamsFilePath, "utf-8");
      let teams = JSON.parse(teamsString);

      for (let i = 0; i < teams.length; i++) {
        teams[i].group_id = groupId;
        teams[i].updated_at = new Date();
        teams[i].created_at = new Date();
        teams[i].team_logo = imageURL;
      }

      let gamesString = fs.readFileSync(gamesFilePath, "utf-8");
      let games = JSON.parse(gamesString);

      for (let i = 0; i < games.length; i++) {
        games[i].session_id = sessionsId;
        games[i].game_date = new Date(games[i].game_date);
        games[i].game_status_id = gameStatusesID;
        games[i].field_id = fieldsId;
        games[i].created_by_id = userId;
        games[i].updated_by_id = userId;
        games[i].updated_at = new Date();
        games[i].created_at = new Date();
      }

      await queryInterface.bulkInsert("Teams", teams, { transaction: t });
      await queryInterface.bulkInsert("Games", games, { transaction: t });

      await t.commit();
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Groups", {
      name: "The FA (Football Federation)",
    });
    await queryInterface.bulkDelete("Roles", {
      role_type: "Staff",
    });
    await queryInterface.bulkDelete("GameStatuses", { status: "Completed" });
  },
};

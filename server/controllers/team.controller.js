"use strict";
const { Team, Group, Division, TeamsSession, Session } = require("./../models");
const TeamsSessionController = require("../controllers/teamSession.controller");
const { getSessionByDivisionAndSeasonId } = require("./session.controller");
const { errorMessageSchema } = require("../schemas/utils.schema");
const {
  TeamSchema,
  CreateTeamSchema,
  UpdateTeamSchema,
  TeamsSchema,
} = require("../schemas/team.schema");

const TeamController = function () {
  /*
    Helper methods
  */
  var isNameUniqueWithinDivision = async function (group_id, name) {
    const team = await Team.findOne({
      where: {
        group_id: group_id,
        name: name,
      },
    });
    return team === null;
  };

  /*
    GET /api/teams/groups/:group_id
  */
  var getTeamsByGroupId = async function (req, res, next) {
    try {
      let { group_id } = req.params;
      group_id = parseInt(group_id, 10);

      if (isNaN(group_id)) {
        throw new Error("Group id must be an integer");
      }

      const teams = await Team.findAll({
        where: {
          group_id: group_id,
        },
      });

      if (Object.keys(teams).length === 0) {
        const message = errorMessageSchema.parse({
          message: `Group with id ${group_id} has no teams`,
        });
        res.status(404).json(message);
      }
      const teamsInGroup = TeamsSchema.parse(
        teams.map((team) => TeamSchema.parse(team.dataValues)),
      );
      return res.status(200).json(teamsInGroup);
    } catch (error) {
      console.error(error);
      const message = errorMessageSchema.parse({
        message: error.message,
      });
      return res.status(500).json(message);
    }
  };

  /*
    GET /api/teams/seasons/:season_id/divisions/:division_id
  */
  var getTeamsBySeasonDivisionId = async function (req, res, next) {
    let { season_id, division_id } = req.params;
    season_id = parseInt(season_id, 10);
    division_id = parseInt(division_id, 10);

    try {
      const result = await Team.findAll({
        include: [
          {
            model: TeamsSession,
            required: true,
            attributes: ["session_id"],
            include: [
              {
                model: Session,
                required: true,
                attributes: [],
                where: {
                  season_id: season_id,
                  division_id: division_id,
                },
              },
            ],
          },
        ],
      });
      console.log("result", result);
      let teams = [];
      for (let i = 0; i < result.length; i++) {
        teams.push(TeamSchema.parse(result[i].dataValues));
      }
      return res.status(200).json(teams);
    } catch (error) {
      console.error(error);
      const message = errorMessageSchema.parse({
        message: error.message,
      });
      return res.status(500).json(message);
    }
  };

  /*
    POST /api/teams
  */
  var createTeam = async function (req, res, next) {
    try {
      const parsedBody = CreateTeamSchema.parse(req.body);
      const { group_id, name, team_logo } = parsedBody;
      const group = await Group.findOne({
        where: {
          id: group_id,
        },
      });
      if (!group) {
        const message = errorMessageSchema.parse({
          message: `Group with id ${group_id} not found`,
        });
        return res.status(404).json(message);
      }

      const teamNameUnique = await isNameUniqueWithinDivision(group_id, name);

      if (!teamNameUnique) {
        const message = errorMessageSchema.parse({
          message: `Team already exists with name ${name} for group ${group_id}`,
        });
        return res.status(400).json(message);
      }

      const newTeam = { group_id, name, team_logo };
      await Team.build(newTeam).validate();
      const result = await Team.create(newTeam);
      const createdTeam = TeamSchema.parse(result.dataValues);
      // if (division_id && season_id) {
      //   const session_id = await getSessionByDivisionAndSeasonId(
      //     division_id,
      //     season_id,
      //   );
      //   const team_id = result.id;
      //   const newTeamSession = { team_id, session_id };
      //   await TeamsSession.build(newTeamSession).validate();
      //   await TeamsSession.create(newTeamSession);
      // }
      return res.status(201).json(createdTeam);
    } catch (error) {
      console.error(error);
      const message = errorMessageSchema.parse({
        message: error.message,
      });
      return res.status(500).json(message);
    }
  };

  /*
    GET /api/teams/:id
  */
  var getTeam = async function (req, res, next) {
    try {
      let { team_id } = req.params;
      team_id = parseInt(team_id, 10);

      let team = await Team.findByPk(team_id);

      if (!team) {
        const message = errorMessageSchema.parse({
          message: `Team with id ${team_id} not found`,
        });
        return res.status(404).json(message);
      }
      const result = TeamSchema.parse(team.dataValues);
      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      const message = errorMessageSchema.parse({
        message: error.message,
      });
      return res.status(500).json(message);
    }
  };

  /*
    PUT /api/teams/:id
  */
  var updateTeam = async function (req, res, next) {
    try {
      let { team_id } = req.params;
      team_id = parseInt(team_id, 10);

      let team = await Team.findByPk(team_id);

      if (!team) {
        const message = errorMessageSchema.parse({
          message: `Team with id ${team_id} not found`,
        });
        return res.status(404).json(message);
      }

      const parsedBody = UpdateTeamSchema.parse(req.body);

      Object.keys(parsedBody).forEach((key) => {
        team[key] = parsedBody[key] !== undefined ? parsedBody[key] : team[key];
      });

      const nameUnique = await isNameUniqueWithinDivision(
        team.group_id,
        team.name,
      );

      if (!nameUnique) {
        const message = errorMessageSchema.parse({
          message: `Team with name ${team.name} already exists in group ${team.group_id}`,
        });
        return res.status(400).json(message);
      }

      await team.validate();
      team = await team.save();
      const updatedTeam = TeamSchema.parse(team.dataValues);
      return res.status(200).json(updatedTeam);
    } catch (error) {
      console.error(error);
      const message = errorMessageSchema.parse({
        message: error.message,
      });
      return res.status(500).json(message);
    }
  };

  /*
    DELETE /api/teams/:id
  */
  var deleteTeam = async function (req, res, next) {
    try {
      let { team_id } = req.params;
      team_id = parseInt(team_id, 10);

      let team = await Team.findByPk(team_id);

      if (!team) {
        const message = errorMessageSchema.parse({
          message: `Team with id ${team_id} not found`,
        });
        return res.status(404).json(message);
      }

      await Team.destroy({
        where: {
          id: team_id,
        },
      });

      let deletedTeam = await Team.findByPk(team_id);
      if (!deletedTeam) {
        return res.status(204).json();
      } else {
        const message = errorMessageSchema.parse({
          message: `Failure to delete team with id: ${team_id}`,
        });
        return res.status(400).json(message);
      }
    } catch (error) {
      console.error(error);
      const message = errorMessageSchema.parse({
        message: error.message,
      });
      return res.status(500).json(message);
    }
  };

  return {
    getTeamsByGroupId,
    getTeamsBySeasonDivisionId,
    getTeam,
    createTeam,
    updateTeam,
    deleteTeam,
  };
};

module.exports = TeamController();

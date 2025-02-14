"use strict";
const { Team, Group, Division, TeamsSession, Session } = require("./../models");

const TeamController = function () {
  var getTeamsByGroupId = async function (req, res, next) {
    const groupId = req.params["id"];

    try {
      const result = await Team.findAll({
        where: {
          group_id: groupId,
        },
      });

      if (Object.keys(result).length === 0) {
        throw new Error("group with given id has no teams");
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  var getTeamsBySeasonDivisionId = async function (req, res, next) {
    const seasonId = req.params["seasonId"];
    const divisionId = req.params["divisionId"];

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
                  season_id: seasonId,
                  division_id: divisionId,
                },
              },
            ],
          },
        ],
      });

      if (Object.keys(result).length === 0) {
        return res.status(200).json([]);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  var getTeamsByGroupId = async function (req, res, next) {
    const groupId = req.params.id;
    try {
      const teams = await Team.findAll({
        where: { group_id: groupId },
        attributes: [
          "id",
          "name",
          "team_logo",
          "created_at",
          "updated_at",
          "group_id",
        ],
        include: [
          {
            model: Group,
            attributes: ["id", "name"],
            include: [
              {
                model: Division,
                attributes: ["id", "name"],
              },
            ],
          },
        ],
      });

      const modifiedTeams = teams.map((team) => {
        const { Group, ...rest } = team.toJSON();
        return {
          ...rest,
          divisions: Group ? Group.Divisions : [],
        };
      });

      res.status(200).json(modifiedTeams);
    } catch (error) {
      next(error);
    }
  };
  var isNameUniqueWithinDivision = async function (groupId, teamName) {
    let teamFound = await Team.findOne({
      where: {
        group_id: groupId,
        name: teamName,
      },
    });

    return teamFound == null;
  };

  var createTeam = async function (req, res, next) {
    const { group_id, name, team_logo, division_id } = req.body;
    const newTeam = { group_id, name, team_logo, division_id };

    try {
      const group = await Group.findOne({
        where: {
          id: newTeam.group_id,
        },
      });
      if (!group) {
        res.status(404);
        throw new Error(`no such group with id ${newTeam.group_id}`);
      }

      const teamNameUnique = await isNameUniqueWithinDivision(
        newTeam.group_id,
        newTeam.name,
      );

      if (!teamNameUnique) {
        res.status(400);
        throw new Error("team name is not unique within the division");
      }

      await Team.build(newTeam).validate();
      const result = await Team.create(newTeam);

      // TODO: add season_id to return specific division tied to season in future
      let session = await Session.findOne({
        where: {
          division_id: division_id,
        },
      });
      console.log("division_id", division_id);
      console.log("division_id", session);

      const team_id = result.id;
      const newTeamSession = { team_id, session_id: session.id };
      await TeamsSession.build(newTeamSession).validate();
      await TeamsSession.create(newTeamSession);

      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  var updateTeam = async function (req, res, next) {
    try {
      let currentTeam = await Team.findOne({
        where: {
          id: req.params["id"],
        },
      });

      if (!currentTeam) {
        res.status(404);
        throw new Error("team with given id was not found");
      }

      if (req.body.name && req.body.name !== currentTeam.name) {
        const nameUnique = await isNameUniqueWithinDivision(
          currentTeam.group_id,
          req.body.name,
        );

        if (!nameUnique) {
          res.status(400);
          throw new Error("team name is not unique within the division");
        }
      }

      Object.keys(req.body).forEach((key) => {
        currentTeam[key] = req.body[key] ? req.body[key] : currentTeam[key];
      });

      await currentTeam.validate();
      await currentTeam.save();

      return res.status(200).json(currentTeam);
    } catch (error) {
      next(error);
    }
  };

  var deleteTeam = async function (req, res, next) {
    try {
      let deletedTeam = await Team.destroy({
        where: {
          id: req.params["id"],
        },
      });

      if (deletedTeam === 0) {
        res.status(404);
        throw new Error("no team found with the given id");
      }

      return res.status(204).json("deleted team successfully");
    } catch (error) {
      next(error);
    }
  };

  return {
    getTeamsByGroupId,
    getTeamsBySeasonDivisionId,
    createTeam,
    updateTeam,
    deleteTeam,
  };
};

module.exports = TeamController();

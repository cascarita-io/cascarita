"use strict";

const { Op } = require("sequelize");
const { League, Season, Session, Team, TeamsSession } = require("../models");
const {
  SeasonSchema,
  SeasonsSchema,
  CreateSeasonSchema,
  UpdateSeasonSchema,
} = require("../schemas/season.schema");
const { errorMessageSchema } = require("../schemas/utils.schema");

const SeasonController = {
  async getSeasonsByLeagueId(req, res, next) {
    try {
      let { league_id } = req.params;
      league_id = parseInt(league_id, 10);
      const league = await League.findByPk(league_id);
      if (!league) {
        const message = errorMessageSchema.parse({
          message: `League with id ${league_id} not found`,
        });
        return res.status(404).json(message);
      }
      const allSeasons = await Season.findAll({
        where: {
          league_id: league.id,
        },
      });
      let seasons = SeasonsSchema.parse(
        allSeasons.map((season) => SeasonSchema.parse(season.dataValues)),
      );
      return res.status(200).json(seasons);
    } catch (error) {
      next(error);
    }
  },

  async getAllSeasons(req, res, next) {
    try {
      let { name, leagueId, isActive } = req.query;
      leagueId = parseInt(leagueId, 10);
      const whereClause = {};

      if (name) {
        whereClause["$Season.name$"] = {
          [Op.substring]: name.toLowerCase().trim(),
        };
      }

      if (leagueId) {
        whereClause["$League.id$"] = leagueId;
      }

      if (isActive) {
        whereClause["is_active"] = isActive.toLowerCase() === "true";
      }

      const seasons = await Season.findAll({
        where: whereClause,
        include: League,
      });
      const allSeasons = SeasonsSchema.parse(
        seasons.map((season) => SeasonSchema.parse(season.dataValues)),
      );
      return res.status(200).json(allSeasons);
    } catch (error) {
      next(error);
    }
  },

  async getSeason(req, res, next) {
    try {
      let { season_id } = req.params;
      season_id = parseInt(season_id, 10);

      const season = await Season.findByPk(season_id, {
        include: League,
      });
      if (!season) {
        const message = errorMessageSchema.parse({
          message: `Season with id ${season_id} not found`,
        });
        return res.status(404).json(message);
      }

      return res.status(200).json(SeasonSchema.parse(season.dataValues));
    } catch (error) {
      next(error);
    }
  },

  async getTeamsByLeagueId(req, res, next) {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        res.status(400);
        throw new Error("league id must be an integer");
      }

      const season = await Season.findOne({
        where: {
          league_id: id,
          is_active: true,
        },
      });
      if (!season) {
        res.status(404);
        throw new Error(`no such season with id ${id}`);
      }

      const session = await Session.findOne({
        where: {
          season_id: season.id,
        },
      });
      if (!session) {
        res.status(404);
        throw new Error(`no such session with id ${season.id}`);
      }

      const teamSession = await TeamsSession.findAll({
        where: {
          session_id: session.id,
        },
        include: Team,
      });
      if (!teamSession) {
        res.status(404);
        throw new Error(`no such team session with id ${session.id}`);
      }

      return res.status(200).json(teamSession);
    } catch (error) {
      next(error);
    }
  },
  async createSeason(req, res, next) {
    try {
      const parsedBody = CreateSeasonSchema.parse(req.body);
      const isUnique = await isNameUniqueWithinLeague(
        parsedBody.name,
        parsedBody.league_id,
      );
      if (!isUnique) {
        const message = errorMessageSchema.parse({
          message: `Season name is not unique within league with id: ${league_id}`,
        });
        return res.status(400).json(message);
      }
      await Season.build(parsedBody).validate();
      const season = await Season.create(parsedBody);
      const createdSeason = SeasonSchema.parse(season.dataValues);
      return res.status(201).json(createdSeason);
    } catch (error) {
      next(error);
    }
  },
  async updateSeason(req, res, next) {
    try {
      let { season_id } = req.params;
      season_id = parseInt(season_id, 10);
      const parsedBody = UpdateSeasonSchema.parse(req.body);

      let season = await Season.findByPk(season_id);
      if (!season) {
        const message = errorMessageSchema.parse({
          message: `Season with id ${season_id} not found`,
        });
        return res.status(404).json(message);
      }

      Object.keys(parsedBody).forEach((key) => {
        if (key !== "league_id") {
          season[key] = parsedBody[key] ? parsedBody[key] : season[key];
        }
      });

      const { name, league_id } = season;
      const isUnique = await isNameUniqueWithinLeague(name, league_id);
      if (!isUnique) {
        const message = errorMessageSchema.parse({
          message: `Season name is not unique within league with id: ${league_id}`,
        });
        return res.status(400).json(message);
      }

      await season.validate();
      season = await season.save();
      const updatedSeason = SeasonSchema.parse(season.dataValues);
      return res.status(200).json(updatedSeason);
    } catch (error) {
      next(error);
    }
  },
  async deleteSeason(req, res, next) {
    try {
      let { season_id } = req.params;
      season_id = parseInt(season_id, 10);
      let season = await Season.findByPk(season_id);
      if (!season) {
        const message = errorMessageSchema.parse({
          message: `Season with id ${season_id} not found`,
        });
        return res.status(404).json(message);
      }

      await season.destroy();
      season = await Season.findByPk(season_id);
      if (season) {
        const message = errorMessageSchema.parse({
          message: `Season with id ${season_id} was not deleted`,
        });
        return res.status(400).json(message);
      }
      res.status(204).json();
    } catch (error) {
      next(error);
    }
  },
};

async function isNameUniqueWithinLeague(name, leagueId) {
  const league = await Season.findOne({
    where: {
      league_id: leagueId,
      name: name,
    },
  });

  return league === null;
}

module.exports = SeasonController;

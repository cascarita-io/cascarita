"use strict";

const { Sequelize, Op } = require("sequelize");
const { League, Season, Session, Team, TeamsSession } = require("../models");

const SeasonController = {
  async getSeasonsByGroupId(req, res, next) {
    const groupId = req.params.id;
    try {
      const seasons = await Season.findAll({
        include: {
          model: League,
          attributes: [],
          where: { group_id: groupId },
        },
        attributes: [
          "id",
          "name",
          "start_date",
          "end_date",
          "is_active",
          "created_at",
          "updated_at",
          [Sequelize.col("League.id"), "league_id"],
          [Sequelize.col("League.name"), "league_name"],
        ],
      });

      if (!seasons || seasons.length === 0) {
        res.status(404);
        throw new Error(`no seasons found with group_id ${groupId}`);
      }

      res.json(seasons);
    } catch (error) {
      next(error);
    }
  },
  async getSeasonsByLeagueId(req, res, next) {
    const leagueId = req.params.id;

    try {
      const league = await League.findByPk(leagueId);
      if (!league) {
        res.status(404);
        throw new Error(`no such league with id ${id}`);
      }
      const seasons = await Season.findAll({
        where: {
          league_id: league.id,
        },
      });

      res.json(seasons);
    } catch (error) {
      next(error);
    }
  },
  async getAllSeasons(req, res, next) {
    try {
      const { query } = req;
      const whereClause = {};

      if (query.name) {
        whereClause["$Season.name$"] = {
          [Op.substring]: query.name.toLowerCase().trim(),
        };
      }

      if (query.league) {
        const league = parseInt(query.league, 10);
        if (isNaN(league)) {
          whereClause["$League.name$"] = {
            [Op.substring]: query.league.toLowerCase().trim(),
          };
        } else {
          whereClause["$League.id$"] = league;
        }
      }
      if (query.is_active) {
        whereClause["is_active"] = query.is_active.toLowerCase() === "true";
      }

      const seasons = await Season.findAll({
        where: whereClause,
        include: League,
      });
      return res.json(seasons);
    } catch (error) {
      next(error);
    }
  },
  async getSeason(req, res, next) {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        res.status(400);
        throw new Error("season id must be an integer");
      }

      const season = await Season.findByPk(id, {
        include: League,
      });
      if (!season) {
        res.status(404);
        throw new Error(`no such season with id ${id}`);
      }

      return res.status(200).json(season);
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
    const form = {
      name: req.body.name,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      is_active: req.body.is_active,
      league_id: req.body.league_id,
    };

    try {
      const isUnique = await isNameUniqueWithinLeague(
        form.name,
        form.league_id,
        null,
      );
      if (!isUnique) {
        return res.status(400).json({ error: "Season name is not unique" });
      }

      await Season.build(form).validate();
      const season = await Season.create(form);

      res.status(201).json(season);
    } catch (error) {
      res.status(400);
      next(error);
    }
  },
  async updateSeason(req, res, next) {
    const { id } = req.params;
    try {
      const season = await Season.findByPk(id);
      if (!season) {
        res.status(404);
        throw new Error(`no such season with id ${id}`);
      }

      Object.keys(req.body).forEach((key) => {
        season[key] = req.body[key] ? req.body[key] : season[key];
      });

      const { name, league_id } = season;
      const isUnique = await isNameUniqueWithinLeague(
        name,
        league_id,
        season.id,
      );
      if (!isUnique) {
        return res
          .status(400)
          .json({ error: "Season name is not unique within league" });
      }

      await season.validate();
      await season.save();
      res.json(season);
    } catch (error) {
      next(error);
    }
  },
  async deleteSeason(req, res, next) {
    const { id } = req.params;
    try {
      let season = await Season.findByPk(id);
      if (season === null) {
        res.status(404);
        throw new Error(`no such season with id ${id}`);
      }

      await season.destroy();
      res.status(204).json();
    } catch (error) {
      next(error);
    }
  },
};

async function isNameUniqueWithinLeague(name, league_id, seasonId) {
  const season = await Season.findOne({
    where: {
      league_id,
      name,
      ...(seasonId && { id: { [Op.ne]: seasonId } }),
    },
  });

  return season === null;
}

module.exports = SeasonController;

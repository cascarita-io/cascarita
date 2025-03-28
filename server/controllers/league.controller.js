"use strict";

const { League, Group, Season } = require("../models");
const { Op } = require("sequelize");
const modelByPk = require("./utility");

const LeagueController = function () {
  var getLeagueByGroupId = async function (req, res, next) {
    const groupId = req.params.id;

    try {
      await modelByPk(res, Group, groupId);
      const result = await League.findAll({
        where: {
          group_id: groupId,
        },
      });

      return res
        .status(200)
        .json(Object.keys(result).length === 0 ? [] : result);
    } catch (error) {
      next(error);
    }
  };

  var isNameUniqueWithinGroup = async function (group_id, name, leagueId) {
    let leagueFound = await League.findOne({
      where: {
        group_id,
        name,
        ...(leagueId && { id: { [Op.ne]: leagueId } }),
      },
    });

    return leagueFound == null;
  };

  var createLeague = async function (req, res, next) {
    const { group_id, name, description } = req.body;
    const newLeague = { group_id, name, description };

    try {
      const isUnique = await isNameUniqueWithinGroup(
        newLeague.group_id,
        newLeague.name,
        null,
      );

      if (!isUnique) {
        return res.status(400).json({ error: "League name is not unique" });
      }

      await League.build(newLeague).validate();
      const result = await League.create(newLeague);

      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  var updateLeague = async function (req, res, next) {
    try {
      let currentLeague = await League.findOne({
        where: {
          id: req.params["id"],
        },
      });

      if (!currentLeague) {
        res.status(400);
        throw new Error("league with given id was not found");
      }

      Object.keys(req.body).forEach((key) => {
        if (key !== "group_id") {
          currentLeague[key] = req.body[key]
            ? req.body[key]
            : currentLeague[key];
        }
      });

      const isUnique = await isNameUniqueWithinGroup(
        currentLeague.group_id,
        currentLeague.name,
        currentLeague.id,
      );

      if (!isUnique) {
        return res.status(400).json({ error: "League name is not unique" });
      }

      await currentLeague.validate();
      await currentLeague.save();

      return res.status(200).json(currentLeague);
    } catch (error) {
      next(error);
    }
  };

  var deleteLeague = async function (req, res, next) {
    try {
      const leagueId = req.params["id"];
      const hasSeasons = await Season.findAll({
        where: {
          league_id: leagueId,
        },
      });

      if (hasSeasons.length > 0) {
        return res.status(409).json({
          error:
            "league cannot be deleted if it has at least one season linked to it",
        });
      }
      let deletedLeague = await League.destroy({
        where: {
          id: leagueId,
        },
      });

      if (deletedLeague === 0) {
        throw new Error("no league found with the given id");
      }

      return res.status(204).json();
    } catch (error) {
      next(error);
    }
  };

  return {
    getLeagueByGroupId,
    createLeague,
    updateLeague,
    deleteLeague,
  };
};

module.exports = LeagueController();

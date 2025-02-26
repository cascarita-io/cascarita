"use strict";

const { League, Session, Season, Division, Group } = require("../models");
const { Op } = require("sequelize");
const modelByPk = require("./utility");
const sessionController = require("./session.controller");
const { Sequelize } = require("sequelize");

const isDivisionNameUnique = async (groupId, name) => {
  const division = await Division.findOne({
    where: {
      group_id: groupId,
      name: name,
    },
  });
  return !division;
};

const DivisionController = {
  getByGroupId: async function (req, res, next) {
    const groupId = req.params.id;

    try {
      await modelByPk(res, Group, groupId);

      const divisions = await Division.findAll({
        where: {
          group_id: groupId,
        },
      });
      res.json(divisions);
    } catch (error) {
      next(error);
    }
  },
  getBySeasonId: async function (req, res, next) {
    const seasonId = req.params.id;

    try {
      const divisions = await Division.findAll({
        include: [
          {
            model: Session,
            where: { season_id: seasonId },
            required: true,
            attributes: [],
          },
        ],
      });

      res.json(divisions);
    } catch (error) {
      next(error);
    }
  },
  create: async function (req, res, next) {
    const form = {
      season_id: req.body.season_id,
      group_id: req.body.group_id,
      name: req.body.name,
    };

    try {
      await modelByPk(res, Group, form.group_id);
      const isUnique = await isDivisionNameUnique(form.group_id, form.name);
      if (!isUnique) {
        res.status(400);
        throw new Error("Division name already taken");
      }
      await Division.build(form).validate();

      const division = await Division.create(form);
      if (form.season_id) {
        await sessionController.createSession(division.id, form.season_id);
      }
      res.status(201).json(division);
    } catch (error) {
      next(error);
    }
  },
  update: async function (req, res, next) {
    const { id } = req.params;
    const { name } = req.body;

    try {
      const division = await modelByPk(res, Division, id);
      division.name = name;
      await division.validate();
      await division.save();
      res.json(division);
    } catch (error) {
      next(error);
    }
  },
  delete: async function (req, res, next) {
    const { id } = req.params;

    try {
      const division = await modelByPk(res, Division, id);

      await division.destroy();
      res.status(204).json();
    } catch (error) {
      next(error);
    }
  },
  getAllDivsionsBySeason: async function (req, res, next) {
    const { seasonId } = req.params;
    const sessions = await Session.findAll({
      where: {
        season_id: seasonId,
      },
      include: {
        model: Division,
        as: "Division", // Alias for the included model
        attributes: ["name"], // Include only the 'name' attribute
      },
    });

    return res.json(sessions);
  },
  getAllDivisionsByGroupId: async function (req, res, next) {
    const { id } = req.params;
    const divisions = await Division.findAll({
      where: { group_id: id },
      attributes: {
        include: [
          [Sequelize.col("Sessions->Season.id"), "season_id"],
          [Sequelize.col("Sessions->Season.name"), "season_name"],
          [Sequelize.col("Sessions->Season->League.id"), "league_id"],
          [Sequelize.col("Sessions->Season->League.name"), "league_name"],
        ],
      },
      include: [
        {
          model: Session,
          attributes: [],
          include: [
            {
              model: Season,
              attributes: [],
              include: [
                {
                  model: League,
                  attributes: [],
                },
              ],
            },
          ],
        },
      ],
    });

    return res.json(divisions);
  },
};

module.exports = DivisionController;

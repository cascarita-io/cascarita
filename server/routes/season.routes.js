"use strict";

const { Router } = require("express");
const SeasonController = require("../controllers/season.controller");
const DivisionController = require("../controllers/division.controller");
const SessionController = require("../controllers/session.controller");

const router = Router();

module.exports = (checkJwt) => {
  router.get("/", SeasonController.getAllSeasons);
  router.get("/:id", SeasonController.getSeason);
  router.get("/:id/leagues", SeasonController.getSeasonsByLeagueId);
  router.get("/group/:id", SeasonController.getSeasonsByGroupId);
  router.get("/:id/divisions", DivisionController.getBySeasonId);
  router.get("/:seasonId/seasonId", DivisionController.getAllDivsionsBySeason);
  router.post("/", SeasonController.createSeason);
  router.patch("/:id", SeasonController.updateSeason);
  router.delete("/:id", SeasonController.deleteSeason);

  return router;
};

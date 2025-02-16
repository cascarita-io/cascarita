"use strict";

const { Router } = require("express");
const SeasonController = require("../controllers/season.controller");
const DivisionController = require("../controllers/division.controller");
const SessionController = require("../controllers/session.controller");

const router = Router();

module.exports = (checkJwt) => {
  router.get("/", SeasonController.getAllSeasons);
  router.get("/:season_id", SeasonController.getSeason);
  router.get("/leagues/:league_id", SeasonController.getSeasonsByLeagueId);
  router.get("/divisions/:division_id", DivisionController.getBySeasonId);
  router.get("/seasons/:season_id", DivisionController.getAllDivsionsBySeason);
  router.post("/", SeasonController.createSeason);
  router.put("/:season_id", SeasonController.updateSeason);
  router.delete("/:season_id", SeasonController.deleteSeason);

  return router;
};

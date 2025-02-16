"use strict";

const express = require("express");
const router = express.Router();
const TeamController = require("../controllers/team.controller");

module.exports = (checkJwt) => {
  router.get(
    "/seasons/:season_id/divisions/:division_id",
    TeamController.getTeamsBySeasonDivisionId,
  );
  router.get("/groups/:group_id", TeamController.getTeamsByGroupId);

  router.get("/:team_id", TeamController.getTeam);
  router.put("/:team_id", TeamController.updateTeam);
  router.delete("/:team_id", TeamController.deleteTeam);

  router.post("/", TeamController.createTeam);

  return router;
};

"use strict";

const express = require("express");
const router = express.Router();
const TeamController = require("../controllers/team.controller");

module.exports = (checkJwt) => {
  router.get(
    "/seasons/:seasonId/divisions/:divisionId",
    TeamController.getTeamsBySeasonDivisionId,
  );
  router.get("/group/:id", TeamController.getTeamsByGroupId);
  router.post("/", TeamController.createTeam);
  router.patch("/:id", TeamController.updateTeam);
  router.delete("/:id", TeamController.deleteTeam);

  return router;
};

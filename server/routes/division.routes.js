"use strict";

const express = require("express");
const DivisionController = require("../controllers/division.controller");
const router = express.Router();

module.exports = (checkJwt) => {
  router.post("/", DivisionController.create);
  router.patch("/:id", DivisionController.update);
  router.delete("/:id", DivisionController.delete);
  router.get("/group/:id", DivisionController.getAllDivisionsByGroupId);
  return router;
};

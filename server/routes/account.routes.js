"use strict";

require("dotenv").config();
const express = require("express");
const AccountController = require("../controllers/account.controller");
const router = express.Router();

module.exports = (checkJwt) => {
  router.post("/connect", AccountController.createAccountConnection);
  router.post(
    "/:account_id/paymentIntent",
    AccountController.createPaymentIntent,
  );
  router.get(
    "/:account_id/paymentIntent/:paymentIntentId",
    AccountController.getClientSecret,
  );

  router.get("/:group_id", AccountController.getAllAccountsByGroupId);
  router.get("/key/publishable", AccountController.getPublishableKey);

  return router;
};

"use strict";

const express = require("express");
const ConnectedAccountController = require("../../controllers/stripeResources/connectedAccount.controller");
const FormTransactionController = require("../../controllers/stripeResources/formTransaction.controller");

const router = express.Router();

router.post("/connect", ConnectedAccountController.handleEvent);
router.post("/form-transaction", FormTransactionController.handleEvent);

module.exports = router;

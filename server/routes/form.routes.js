"use strict";

const express = require("express");
const router = express.Router();
const FormController = require("../controllers/form.controller");
const FormPaymentController = require("../controllers/formPayment.controller");

module.exports = (checkJwt) => {
  router.post("/:group_id/:user_id", FormController.createForm);
  router.post("/responses", FormController.createResponse);
  router.get("/:form_id/responses", FormController.getResponsesByFormId);
  router.get("/document/:document_id", FormController.getFormByDocumentId);
  router.patch("/:form_id", FormController.updateForm);
  router.delete("/:form_id", FormController.deleteForm);
  router.post("/payment", FormPaymentController.getFormPayments);
  router.post("/paymenttype", FormPaymentController.updateFormPaymentType);
  router.post("/status", FormPaymentController.updatePaymentStatus);
  return router;
};

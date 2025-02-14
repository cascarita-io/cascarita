"use strict";
const ConnectedAccountController = require("./connectedAccount.controller");

const FormTransactionController = function () {
  const endpointSecret = process.env.STRIPE_CONNECTED_ACCOUNTS_WEBHOOK_SECRET;

  var handleEvent = async function (req, res) {
    try {
      let event = ConnectedAccountController.verifyRequest(
        req.body,
        req.headers["stripe-signature"],
        endpointSecret,
      );
      console.log("here before the switch statement");

      let statusCode = 200;
      let responseBody = { message: "event handled!" };
      switch (event.type) {
        case "charge.captured":
          const chargeObj = event.data.object;
          console.log(chargeObj);
          break;
        default:
          statusCode = 403;
          responseBody = { message: "transaction: unhandled event type" };
      }
      return res.status(statusCode).json(responseBody);
    } catch (error) {
      return res.status(400).send(`webhook error: ${error.message}`);
    }
  };

  return {
    handleEvent,
  };
};

module.exports = FormTransactionController();

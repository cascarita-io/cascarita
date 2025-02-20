"use strict";
const ConnectedAccountController = require("./connectedAccount.controller");
const FormPaymentController = require("../formPayment.controller");

const FormTransactionController = function () {
  const endpointSecret = process.env.STRIPE_CONNECTED_ACCOUNTS_WEBHOOK_SECRET;

  var handleEvent = async function (req, res) {
    try {
      let event = ConnectedAccountController.verifyRequest(
        req.body,
        req.headers["stripe-signature"],
        endpointSecret,
      );

      switch (event.type) {
        case "payment_intent.succeeded":
          const paymentIntent = event.data.object;
          const success = await FormPaymentController.updateStripePayment(
            paymentIntent,
          );

          return res.status(200).json({
            message: success
              ? "Payment updated successfully"
              : "Payment update failed but webhook received",
          });

        default:
          console.log(`Unhandled webhook event type: ${event.type}`);
          return res.status(200).json({
            message: "Unhandled event type, but webhook received",
          });
      }
    } catch (error) {
      console.error("Webhook error:", error);
      return res.status(400).json({
        message: `Webhook error: ${error.message}`,
      });
    }
  };

  return {
    handleEvent,
  };
};

module.exports = FormTransactionController();

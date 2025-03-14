"use strict";
require("dotenv").config();
const Stripe = require("stripe")(process.env.STRIPE_TEST_API_KEY);
const FormPaymentController = require("../formPayment.controller");
const StripeEventController = require("../stripeEvent.controller");

const FormTransactionController = function () {
  const endpointSecret = process.env.STRIPE_CONNECTED_ACCOUNTS_WEBHOOK_SECRET;

  var handleEvent = async function (req, res) {
    try {
      let event = Stripe.webhooks.constructEvent(
        req.body,
        req.headers["stripe-signature"],
        endpointSecret,
      );

      const storedStripeEvent = await StripeEventController.validateEvent(
        event,
      );

      if (!storedStripeEvent.success) {
        return res.status(200).json({
          received: true,
          success: false,
          message: storedStripeEvent.error,
        });
      }

      if (storedStripeEvent.skip) {
        return res.status(200).json({
          received: true,
          success: true,
          message: storedStripeEvent.data,
        });
      }

      const paymentIntent = event.data.object;

      switch (event.type) {
        case "payment_intent.amount_capturable_updated": {
          const paymentUpdateResult =
            await FormPaymentController.updateStripePayment(paymentIntent);
          return res.status(200).json({
            received: true,
            success: paymentUpdateResult.success,
            message: paymentUpdateResult.success
              ? paymentUpdateResult.data
              : {
                  error: paymentUpdateResult.error,
                },
          });
        }

        case "payment_intent.succeeded": {
          const paymentUpdateResult =
            await FormPaymentController.updateStripePayment(paymentIntent);

          if (!paymentUpdateResult.success) {
            console.warn(
              `web-hook payment update failed: ${paymentUpdateResult.message}`,
            );
            return res.status(200).json({
              received: true,
              success: false,
              error: paymentUpdateResult.message,
            });
          }

          const userUpdateResult =
            await FormPaymentController.handleUserUpdateStripe(paymentIntent);

          if (!userUpdateResult.success) {
            console.warn(
              `web-hook user update failed: ${userUpdateResult.error}`,
            );
            return res.status(200).json({
              received: true,
              success: false,
              error: userUpdateResult.error,
            });
          }

          return res.status(200).json({
            received: true,
            success: true,
            message: "User payment processed successfully",
            data: userUpdateResult.data,
          });
        }

        case "payment_intent.canceled": {
          const paymentUpdateResult =
            await FormPaymentController.updateStripePayment(paymentIntent);

          if (!paymentUpdateResult.success) {
            console.warn(
              `web-hook payment update failed: ${paymentUpdateResult.message}`,
            );
            return res.status(200).json({
              received: true,
              success: false,
              error: paymentUpdateResult.message,
            });
          }

          return res.status(200).json({
            received: true,
            success: true,
            message: paymentUpdateResult.data,
          });
        }
        // TODO : Handle a a refund

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

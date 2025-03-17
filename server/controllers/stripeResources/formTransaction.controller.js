"use strict";
require("dotenv").config();
const Stripe = require("stripe")(process.env.STRIPE_TEST_API_KEY);
const FormPaymentController = require("../formPayment.controller");
const StripeEventController = require("../stripeEvent.controller");

const FormTransactionController = function () {
  const endpointSecret = process.env.STRIPE_PAYMENTS_WEBHOOK_SECRET;

  var handleEvent = async function (req, res) {
    let event;
    try {
      event = Stripe.webhooks.constructEvent(
        req.body,
        req.headers["stripe-signature"],
        endpointSecret,
      );

      res.status(200).json({
        received: true,
        message: `webhook received, processing event: ${event.id}asynchronously`,
      });

      processEvent(event).catch((error) => {
        console.error({
          event: "webhook_async_processing_error",
          error: error.message,
          stack: error.stack,
          eventId: event.id,
          eventType: event.type,
        });
      });
    } catch (error) {
      console.error({
        event: "webhook_signature_verification_error",
        error: error.message,
        stack: error.stack,
      });
      return res.status(400).json({
        message: `webhook signature verification failed: ${error.message}`,
      });
    }
  };

  var processEvent = async function (event) {
    try {
      const storedStripeEvent = await StripeEventController.validateEvent(
        event,
      );

      if (!storedStripeEvent.success) {
        console.error(`Failed to store event: ${storedStripeEvent.error}`);
        return;
      }

      if (storedStripeEvent.skip) {
        console.log(`Skipping event: ${storedStripeEvent.data}`);
        return;
      }

      await StripeEventController.updateEventStatus(event.id, "processing");

      const paymentIntent = event.data.object;

      switch (event.type) {
        case "payment_intent.amount_capturable_updated": {
          const paymentUpdateResult =
            await FormPaymentController.updateStripePayment(paymentIntent);

          if (!paymentUpdateResult.success) {
            console.warn({
              event: "webhook_form_payment_update_failed",
              message: paymentUpdateResult.error,
              payment_intent_id: paymentIntent.id,
            });
            await StripeEventController.updateEventStatus(event.id, "failed");
            break;
          }

          console.log({
            event: "webhook_form_payment_updated",
            message: paymentUpdateResult.data,
            paymentIntentId: paymentIntent.id,
          });

          await StripeEventController.updateEventStatus(event.id, "completed");
          break;
        }

        case "payment_intent.succeeded": {
          const paymentUpdateResult =
            await FormPaymentController.updateStripePayment(paymentIntent);

          if (!paymentUpdateResult.success) {
            console.warn({
              event: "webhook_form_payment_update_failed",
              message: paymentUpdateResult.error,
              payment_intent_id: paymentIntent.id,
            });
            await StripeEventController.updateEventStatus(event.id, "failed");
            break;
          }

          console.log({
            event: "webhook_form_payment_updated",
            message: paymentUpdateResult.data,
            paymentIntentId: paymentIntent.id,
          });

          const userUpdateResult =
            await FormPaymentController.handleUserUpdateStripe(paymentIntent);

          if (!userUpdateResult.success) {
            console.warn({
              event: "webhook_user_update_failed",
              error: userUpdateResult.error,
              paymentIntentId: paymentIntent.id,
            });

            await StripeEventController.updateEventStatus(event.id, "failed");
            break;
          }

          console.log({
            event: "webhook_user_created_or_updated",
            message: userUpdateResult.data,
            paymentIntentId: paymentIntent.id,
          });
          await StripeEventController.updateEventStatus(event.id, "completed");
          break;
        }

        case "payment_intent.canceled": {
          const paymentUpdateResult =
            await FormPaymentController.updateStripePayment(paymentIntent);

          if (!paymentUpdateResult.success) {
            console.warn({
              event: "webhook_form_payment_update_failed",
              message: paymentUpdateResult.error,
              payment_intent_id: paymentIntent.id,
            });
            await StripeEventController.updateEventStatus(event.id, "failed");
            break;
          }

          console.log({
            event: "webhook_cancel_form_payment",
            message: paymentUpdateResult.data,
            paymentIntentId: paymentIntent.id,
          });

          await StripeEventController.updateEventStatus(event.id, "completed");
          break;
        }

        case "refund.created": {
          let data = event.data.object;
          data.refund_event_type = event.type;

          const refundUpdate = await FormPaymentController.handleStripeRefund(
            data,
          );

          if (!refundUpdate.success) {
            console.warn({
              event: "webhook_refund_created_failed",
              error: refundUpdate.error,
            });

            await StripeEventController.updateEventStatus(event.id, "failed");
            break;
          }

          console.log({
            event: "webhook_refund_created",
            message: refundUpdate.data,
          });

          await StripeEventController.updateEventStatus(event.id, "completed");

          break;
        }

        case "refund.updated": {
          let data = event.data.object;
          data.refund_event_type = event.type;

          const refundUpdate = await FormPaymentController.handleStripeRefund(
            data,
          );

          if (!refundUpdate.success) {
            console.warn({
              event: "webhook_refund_update_failed",
              error: refundUpdate.error,
            });

            await StripeEventController.updateEventStatus(event.id, "failed");
            break;
          }

          console.log({
            event: "webhook_refund_updated",
            message: refundUpdate.data,
          });

          await StripeEventController.updateEventStatus(event.id, "completed");

          break;
        }

        default:
          console.log(`Unhandled webhook event type: ${event.type}`);
          await StripeEventController.updateEventStatus(event.id, "completed");
          break;
      }
    } catch (error) {
      console.error({
        event: "webhook_internal_process_error",
        error: error.message,
        stack: error.stack,
      });

      await StripeEventController.updateEventStatus(event.id, "failed");

      return;
    }
  };

  return {
    handleEvent,
  };
};

module.exports = FormTransactionController();

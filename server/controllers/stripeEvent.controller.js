"use strict";

require("dotenv").config();

const { StripeEvent } = require("../models");

const StripeEventController = function () {
  var validateEvent = async function (event) {
    try {
      const eventType = event.type;
      const ignore = ignoreEvent(eventType);

      if (ignore) {
        return {
          success: true,
          skip: true,
          data: `not tracking events of type : ${eventType}`,
          status: 200,
        };
      }
      const eventId = event.id;
      const existingEvent = await StripeEvent.findOne({
        where: { event_id: eventId },
      });

      if (existingEvent) {
        return {
          success: true,
          skip:
            existingEvent.internal_status === "completed" ||
            existingEvent.internal_status === "processing",
          data: `event ${eventId} already processed, skipping`,
          status: 200,
        };
      }

      await StripeEvent.create({
        event_id: eventId,
        stripe_account_id: event.account,
        event_type: eventType,
        payload: event,
        internal_status: "received",
        livemode: event.livemode,
      });

      return {
        success: true,
        skip: false,
        data: `successfully saved the event: ${eventId}`,
        status: 200,
      };
    } catch (error) {
      return {
        success: false,
        error: `error handling storing Stripe event on databsae : ${error.message}`,
        status: 500,
      };
    }
  };

  var updateEventStatus = async function (eventId, status) {
    try {
      await StripeEvent.update(
        { internal_status: status },
        { where: { event_id: eventId } },
      );
    } catch (error) {
      console.error({
        event: "event_internal_status_update_failed",
        eventId: eventId,
        internal_status: status,
        error: error.message,
      });
    }
  };

  var ignoreEvent = function (eventType) {
    const acceptableEvents = [
      "payment_intent.amount_capturable_updated",
      "payment_intent.succeeded",
      "payment_intent.canceled",
      "refund.created",
      "refund.updated",
      // "charge.refunded",
    ];

    return !acceptableEvents.includes(eventType);
  };
  return {
    validateEvent,
    updateEventStatus,
  };
};

module.exports = StripeEventController();

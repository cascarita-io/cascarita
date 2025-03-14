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
            existingEvent.status === "completed" ||
            existingEvent.status === "processing",
          data: `event ${eventId} already processed, skipping`,
          status: 200,
        };
      }

      await StripeEvent.create({
        event_id: eventId,
        event_type: eventType,
        payload: event,
        status: "received",
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

  var ignoreEvent = function (eventType) {
    const acceptableEvents = [
      "payment_intent.amount_capturable_updated",
      "payment_intent.succeeded",
      "payment_intent.canceled",
    ];

    return !acceptableEvents.includes(eventType);
  };
  return {
    validateEvent,
  };
};

module.exports = StripeEventController();

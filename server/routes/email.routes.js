"use strict";
const { SendBulkTemplatedEmailCommand } = require("@aws-sdk/client-ses");
const { SESClient } = require("@aws-sdk/client-ses");

const express = require("express");
const router = express.Router();
require("dotenv").config();

const sesClient = new SESClient({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

const VERIFIED_EMAIL = process.env.VERIFIED_EMAIL;
const EMAIL_TEMPLATE_NAME = process.env.EMAIL_TEMPLATE_NAME;

const createTemplatedEmail = (emails, link) => {
  return new SendBulkTemplatedEmailCommand({
    Destinations: emails.map((email) => ({
      Destination: { ToAddresses: [email] },
      ReplacementTemplateData: JSON.stringify({ form_link: link }),
    })),
    DefaultTemplateData: JSON.stringify({
      form_link: "https://app.cascarita.io/invalid",
    }),
    Source: `Cascarita <${VERIFIED_EMAIL}>`,
    Template: EMAIL_TEMPLATE_NAME,
  });
};

const createApprovalEmail = (
  emails,
  league_name,
  season_name,
  player_name,
  payment_amount,
  payment_date,
  transaction_id,
) => {
  return new SendBulkTemplatedEmailCommand({
    Destinations: emails.map((email) => ({
      Destination: { ToAddresses: [email] },
      ReplacementTemplateData: JSON.stringify({
        player_name: player_name,
        league_name: league_name,
        season_name: season_name,
        payment_amount: payment_amount,
        payment_date: payment_date,
        transaction_id: transaction_id,
      }),
    })),
    DefaultTemplateData: JSON.stringify({
      form_link: "https://app.cascarita.io/invalid",
    }),
    Source: `Cascarita <${VERIFIED_EMAIL}>`,
    Template: "CascaritaApprovalTemplate",
  });
};

const createRejectionEmail = (
  emails,
  league_name,
  season_name,
  player_name,
  payment_amount,
) => {
  return new SendBulkTemplatedEmailCommand({
    Destinations: emails.map((email) => ({
      Destination: { ToAddresses: [email] },
      ReplacementTemplateData: JSON.stringify({
        player_name: player_name,
        league_name: league_name,
        season_name: season_name,
        payment_amount: payment_amount,
      }),
    })),
    DefaultTemplateData: JSON.stringify({
      form_link: "https://app.cascarita.io/invalid",
    }),
    Source: `Cascarita <${VERIFIED_EMAIL}>`,
    Template: "CascaritaRejectionTemplate",
  });
};

module.exports = (checkJwt) => {
  router.post("/send", async (req, res) => {
    try {
      const { emails, link } = req.body; //
      const createTemplateEmailCommand = createTemplatedEmail(emails, link); //

      try {
        const result = await sesClient.send(createTemplateEmailCommand);
        if (result.$metadata.httpStatusCode !== 200) {
          console.error("Email not sent successfully.");
          res.status(500).json({ error: "Email not sent successfully " });
        }
      } catch (caught) {
        if (caught instanceof Error && caught.name === "MessageRejected") {
          /** @type { import('@aws-sdk/client-ses').MessageRejected} */
          const messageRejectedError = caught;
          console.error(messageRejectedError);
        }
        throw caught;
      }
      res.status(204).json();
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  router.post("/approval/send", async (req, res) => {
    try {
      const {
        emails,
        league_name,
        season_name,
        player_name,
        payment_amount,
        payment_date,
        transaction_id,
      } = req.body;
      const createTemplateEmailCommand = createApprovalEmail(
        emails,
        league_name,
        season_name,
        player_name,
        payment_amount,
        payment_date,
        transaction_id,
      );

      try {
        const result = await sesClient.send(createTemplateEmailCommand);
        if (result.$metadata.httpStatusCode !== 200) {
          console.error("Email not sent successfully.");
          res.status(500).json({ error: "Email not sent successfully " });
        }
      } catch (caught) {
        if (caught instanceof Error && caught.name === "MessageRejected") {
          /** @type { import('@aws-sdk/client-ses').MessageRejected} */
          const messageRejectedError = caught;
          console.error(messageRejectedError);
        }
        throw caught;
      }
      res.status(204).json();
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  router.post("/rejection/send", async (req, res) => {
    try {
      const { emails, league_name, season_name, player_name, payment_amount } =
        req.body;
      const createTemplateEmailCommand = createRejectionEmail(
        emails,
        league_name,
        season_name,
        player_name,
        payment_amount,
      );

      try {
        const result = await sesClient.send(createTemplateEmailCommand);
        if (result.$metadata.httpStatusCode !== 200) {
          console.error("Email not sent successfully.");
          res.status(500).json({ error: "Email not sent successfully " });
        }
      } catch (caught) {
        if (caught instanceof Error && caught.name === "MessageRejected") {
          /** @type { import('@aws-sdk/client-ses').MessageRejected} */
          const messageRejectedError = caught;
          console.error(messageRejectedError);
        }
        throw caught;
      }
      res.status(204).json();
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};

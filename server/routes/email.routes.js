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
  region: process.env.REGION,
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

module.exports = (checkJwt) => {
  router.post("/send", async (req, res) => {
    try {
      const { emails, link } = req.body;
      const createTemplateEmailCommand = createTemplatedEmail(emails, link);

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

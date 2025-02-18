"use strict";
const Stripe = require("stripe")(process.env.STRIPE_TEST_API_KEY);
const { UserStripeAccounts } = require("../../models");
const AccountController = require("../account.controller");

const ConnectAccountController = function () {
  const endpointSecret = process.env.STRIPE_CONNECTED_ACCOUNTS_WEBHOOK_SECRET;

  var verifyRequest = function (rawPayload, signature, endpointSecret) {
    try {
      return Stripe.webhooks.constructEvent(
        rawPayload,
        signature,
        endpointSecret,
      );
    } catch (error) {
      console.error(error.message);
    }
  };

  var handleEvent = async function (req, res) {
    try {
      let event = verifyRequest(
        req.body,
        req.headers["stripe-signature"],
        endpointSecret,
      );

      let statusCode = 200;
      let responseBody = { message: "Event handled!" };

      switch (event.type) {
        case "account.updated":
          const accountInfo = event.data.object;
          const updated = await _updateAccount(accountInfo);
          if (!updated) {
            statusCode = 500;
            responseBody = { message: "Error updating account" };
          }
          break;
        default:
          statusCode = 403;
          responseBody = { message: "Unhandled event type" };
      }
      return res.status(statusCode).json(responseBody);
    } catch (error) {
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }
  };

  var _updateAccount = async function (account) {
    const stripeId = account.id;

    try {
      const currentAccount = await UserStripeAccounts.findOne({
        where: {
          stripe_account_id: stripeId,
        },
      });

      const stripeStatusId = await AccountController.calculateStripeStatus(
        account,
      );

      const updates = {
        stripe_account_name: account.business_profile.name,
        platform_account_name: account.metadata.cascarita_account_name || null,
        platform_account_description:
          account.metadata.cascarita_account_description || null,
        account_email: account.email,
        support_email: account.business_profile.support_email,
        details_submitted: account.details_submitted,
        requires_verification: account.requirements.currently_due.length > 0,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
        stripe_status_id: stripeStatusId,
      };

      await currentAccount.update(updates, { validate: true });
      return true;
    } catch (error) {
      console.error("error updating stripe account: " + error.message);
      return false;
    }
  };

  return {
    handleEvent,
    verifyRequest,
  };
};

module.exports = ConnectAccountController();

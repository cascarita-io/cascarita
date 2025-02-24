"use strict";

require("dotenv").config();

const Response = require("../mongoModels/response");

const Stripe = require("stripe")(process.env.STRIPE_TEST_API_KEY);
const {
  UserStripeAccounts,
  User,
  StripeStatus,
  Group,
  FormPayment,
} = require("../models");
//const FormPaymentController = require("./formPayment.controller");
const modelByPk = require("./utility");

const AccountController = function () {
  var createAccountConnection = async function (req, res, next) {
    try {
      const user = req.body;
      let account;
      let accountId;

      const existingStripeAccount = await UserStripeAccounts.findOne({
        where: {
          user_id: user.id,
        },
      });

      if (existingStripeAccount) {
        accountId = existingStripeAccount.stripe_account_id;
      } else {
        account = await Stripe.accounts.create({
          country: "US",
          email: user.email,
          type: "standard",
        });

        accountId = account.id;
      }

      const accountLink = await Stripe.accountLinks.create({
        account: accountId,
        refresh_url: "http://localhost:3000/forms",
        return_url: "http://localhost:3000/home",
        type: "account_onboarding",
      });

      if (!existingStripeAccount) {
        const defaultStatus = await StripeStatus.findOne({
          where: {
            status: "Restricted",
          },
        });
        await UserStripeAccounts.create({
          user_id: user.id,
          stripe_account_id: accountId,
          details_submitted: false,
          requires_verification: true,
          charges_enabled: false,
          payouts_enabled: false,
          platform_account_name: user.platform_account_name,
          platform_account_description: user.platform_account_description,
          account_email: user.account_email,
          stripe_status_id: defaultStatus.id,
        });
      }

      res.status(201).json({ url: accountLink.url });
    } catch (error) {
      next(error);
    }
  };

  var createPaymentIntent = async function (req, res, next) {
    try {
      let productObj = req.body;

      const paymentIntent = await Stripe.paymentIntents.create(
        {
          amount: productObj.transactionAmount,
          currency: "usd",
          automatic_payment_methods: {
            enabled: true,
          },
          capture_method: "manual",
          application_fee_amount: productObj.transactionFee,
        },
        {
          stripeAccount: req.params["account_id"],
        },
      );

      productObj.paymentIntentId = paymentIntent.id;
      productObj.paymentIntentStatus = paymentIntent.status;
      await createStripeFormPayment(productObj);

      return res.status(200).json({
        client_secret: paymentIntent.client_secret,
        //paymentIntentId: paymentIntent.id,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  var getStripeAccountId = async function (accountId) {
    const stripeAccount = await UserStripeAccounts.findByPk(accountId);
    return stripeAccount.stripe_account_id;
  };

  var getClientSecret = async function (req, res, next) {
    try {
      const paymentIntentId = req.params["paymentIntentId"];
      const stripeAccountId = await getStripeAccountId(
        req.params["account_id"],
      );

      let paymentIntentIdStr = paymentIntentId.toString();
      const paymentIntent = await Stripe.paymentIntents.retrieve(
        paymentIntentIdStr,
        {
          stripeAccount: stripeAccountId,
        },
      );

      res.status(200).json({ cleintSecret: paymentIntent.client_secret });
    } catch (error) {
      next(error);
    }
  };

  var getAllAccountsByGroupId = async function (req, res, next) {
    try {
      const groupId = req.params.group_id;
      await modelByPk(res, Group, groupId);

      const accounts = await UserStripeAccounts.findAll({
        attributes: [
          "id",
          "user_id",
          "stripe_account_id",
          "stripe_account_name",
          "platform_account_name",
          "platform_account_description",
          "account_email",
          "support_email",
        ],
        include: [
          {
            model: User,
            as: "User",
            where: {
              group_id: groupId,
            },
            attributes: ["first_name", "last_name", "email"],
          },
          {
            model: StripeStatus,
            as: "StripeStatus",
            attributes: ["id", "status"],
          },
        ],
      });

      const flattenedAccounts = accounts.map((account) => ({
        id: account.id,
        stripe_account_id: account.stripe_account_id,
        stripe_account_name: account.stripe_account_name,
        platform_account_name: account.platform_account_name,
        platform_account_description: account.platform_account_description,
        account_email: account.account_email,
        support_email: account.support_email,
        stripe_status_id: account.StripeStatus.id,
        stripe_status: account.StripeStatus.status,
        user_id: account.user_id,
        first_name: account.User.first_name,
        last_name: account.User.last_name,
        user_email: account.User.email,
      }));

      let data = flattenedAccounts.length != 0 ? flattenedAccounts : [];

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  var calculateStripeStatus = async function (account) {
    const rejectedReasons = [
      "rejected.fraud",
      "rejected.incomplete_verification",
      "rejected.listed",
      "rejected.other",
      "rejected.terms_of_service",
      "platform_paused",
      "under_review",
    ];

    let status = "Restricted";
    if (rejectedReasons.includes(account.requirements.disabled_reason)) {
      status = "Rejected";
    } else if (!account.payouts_enabled || !account.charges_enabled) {
      status = "Restricted";
    } else if (
      account.future_requirements.pending_verification?.length != 0 ||
      account.requirements.pending_verification?.length != 0
    ) {
      status = "Pending";
    } else if (account.current_deadline) {
      status = "Restricted Soon";
    } else if (account.requirements.eventually_due?.length >= 1) {
      status = "Enabled";
    } else {
      status = "Complete";
    }

    const stripeStatusId = await StripeStatus.findOne({
      where: {
        status: status,
      },
    });

    return stripeStatusId.id;
  };

  const getPublishableKey = function (req, res, next) {
    res.status(200).json({ key: process.env.STRIPE_PUBLISHABLE_KEY });
  };

  var capturePaymentIntent = async function (
    paymentIntentId,
    email,
    formattedAnswers,
    userSelectedStatus,
  ) {
    try {
      const { id } = await User.findOne({
        where: { email: email },
      });

      const { stripe_account_id } = await UserStripeAccounts.findOne({
        where: {
          user_id: id,
        },
      });

      const paymentIntent = await Stripe.paymentIntents.capture(
        paymentIntentId,
        {
          stripeAccount: stripe_account_id,
        },
      );

      const formPaymentResult = await FormPayment.findOne({
        where: { payment_intent_id: paymentIntentId },
      });

      if (formPaymentResult) {
        const updates = {
          internal_status_updated_by: id,
          internal_status_updated_at: new Date(),
        };

        await formPaymentResult.update(updates, { validate: true });
      }

      if (formattedAnswers) {
        const responseId = formPaymentResult.response_document_id;

        await Response.updateOne(
          { _id: responseId },
          {
            $set: {
              formatted_answers: formattedAnswers,
              user_selected_status: userSelectedStatus,
            },
          },
        );
      }

      return paymentIntent;
    } catch (error) {
      console.error(error);
    }
  };

  var createStripeFormPayment = async function (formData) {
    await FormPayment.create({
      form_id: formData.form_id,
      payment_method_id: 1, //since this go triggred, it is stripe payment
      internal_status_id: 1, // set it to default 'Pending'
      amount: formData.transactionAmount,
      payment_intent_id: formData.paymentIntentId,
      payment_intent_status: formData.paymentIntentStatus,
      user_stripe_account_id: formData.userStripeAccountSqlId,
    });
  };

  return {
    createAccountConnection,
    createPaymentIntent,
    getStripeAccountId,
    getClientSecret,
    getAllAccountsByGroupId,
    calculateStripeStatus,
    getPublishableKey,
    capturePaymentIntent,
  };
};

module.exports = AccountController();

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
        refresh_url: process.env.DOMAIN
          ? `${process.env.DOMAIN}/forms`
          : "http://localhost/forms",
        return_url: process.env.DOMAIN
          ? `${process.env.DOMAIN}`
          : "http://localhost",
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
      productObj.stripeAccountIdString = req.params["account_id"];

      // TODO: Set up a more dynamic fee structure !
      const cascaritaFee = 200;
      const totalAmount = calculateTotalAmount(
        productObj.transactionAmount,
        productObj.isCustomerPayingFee,
        cascaritaFee,
      );

      const paymentIntent = await Stripe.paymentIntents.create(
        {
          amount: totalAmount,
          currency: "usd",
          automatic_payment_methods: {
            enabled: true,
          },
          capture_method: "manual",
          application_fee_amount: cascaritaFee,
        },
        {
          stripeAccount: productObj.stripeAccountIdString,
        },
      );

      productObj.paymentIntentId = paymentIntent.id;
      productObj.paymentIntentStatus = paymentIntent.status;
      productObj.updatedTotal = totalAmount;
      await createStripeFormPayment(productObj);

      return res.status(200).json({
        client_secret: paymentIntent.client_secret,
        id: paymentIntent.id,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  var calculateTotalAmount = function (
    intendedAmount,
    isCustomerPaying,
    applicationFee,
  ) {
    const stripePercentage = 0.029;
    const stripeFixedFee = 30;

    if (isCustomerPaying) {
      let totalAmount = Math.ceil(
        (intendedAmount + applicationFee + stripeFixedFee) /
          (1 - stripePercentage),
      );
      return totalAmount;
    } else {
      let totalAmount = intendedAmount + applicationFee;
      let stripeFee = Math.ceil(
        totalAmount * stripePercentage + stripeFixedFee,
      );
      return totalAmount + stripeFee;
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

      const formPayment = await FormPayment.findOne({
        where: { payment_intent_id: paymentIntentId },
      });

      if (!formPayment) {
        return {
          success: false,
          error: `no linked stripe account found for payment intent id: ${paymentIntentId}`,
          status: 404,
        };
      }

      const retrievePaymentIntent = await getPaymentIntentStatus(
        paymentIntentId,
        formPayment.stripe_account_id_string,
      );

      if (!retrievePaymentIntent.success) {
        return retrievePaymentIntent;
      }

      if (retrievePaymentIntent.data.status === "succeeded") {
        return {
          success: false,
          data: `payment intent of status succeeded can not be captured: ${retrievePaymentIntent.data}`,
          status: 304,
        };
      }

      const paymentIntent = await Stripe.paymentIntents.capture(
        paymentIntentId,
        {
          stripeAccount: formPayment.stripe_account_id_string,
        },
      );

      if (!paymentIntent) {
        return {
          success: false,
          error: `no stripe payment intent found with id of: ${paymentIntentId}`,
          status: 404,
        };
      }

      const updates = {
        internal_status_updated_by: id,
        internal_status_updated_at: new Date(),
      };

      await formPayment.update(updates, { validate: true });

      if (formattedAnswers) {
        const responseId = formPayment.response_document_id;

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

      return {
        success: true,
        data: `successfuly captured payment intent: ${paymentIntentId}`,
        status: 200,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: `process of capturing payment intent failed:  ${error.message}`,
        status: 500,
      };
    }
  };

  var createStripeFormPayment = async function (formData) {
    await FormPayment.create({
      form_id: formData.form_id,
      payment_method_id: 1, //since this go triggred, it is stripe payment
      internal_status_id: 1, // set it to default 'Pending'
      amount: formData.totalAmount,
      payment_intent_id: formData.paymentIntentId,
      payment_intent_status: formData.paymentIntentStatus,
      stripe_account_id_string: formData.stripeAccountIdString,
    });
  };

  var getPaymentIntentStatus = async function (
    paymentIntentId,
    stripeAccountId,
  ) {
    try {
      const foundPaymentIntent = await Stripe.paymentIntents.retrieve(
        paymentIntentId,
        {
          stripeAccount: stripeAccountId,
        },
      );

      if (!foundPaymentIntent) {
        return {
          success: false,
          error: "Payment intent not found",
          status: 404,
        };
      }

      return {
        success: true,
        data: {
          status: foundPaymentIntent.status,
          amount: foundPaymentIntent.amount,
          capturable: foundPaymentIntent.amount_capturable > 0,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        status: 500,
      };
    }
  };

  return {
    createAccountConnection,
    createPaymentIntent,
    getAllAccountsByGroupId,
    calculateStripeStatus,
    getPublishableKey,
    capturePaymentIntent,
  };
};

module.exports = AccountController();

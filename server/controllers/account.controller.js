"use strict";

require("dotenv").config();

const Response = require("../mongoModels/response");
const createPayerUser = require("../utilityFunctions/createPayerUser");
const { Form } = require("../models");

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
      const cascaritaFee = 0;
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
          //application_fee_amount: cascaritaFee,
        },
        {
          stripeAccount: productObj.stripeAccountIdString,
        },
      );

      productObj.paymentIntentId = paymentIntent.id;
      productObj.paymentIntentStatus = paymentIntent.status;
      productObj.updatedTotal = totalAmount;
      await createFormPayment(productObj);

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
      return totalAmount;
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
        stripe_account_link: `https://dashboard.stripe.com/${account.stripe_account_id}`,
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
    isUserAction,
    isStripePayment,
  ) {
    try {
      const preparedInfo = await preparePaymentIntentOperation(
        paymentIntentId,
        email,
        isUserAction,
        isStripePayment,
      );

      if (!preparedInfo.success) {
        return preparedInfo;
      }

      const { userId, formPayment, paymentIntentData } = preparedInfo;

      if (isStripePayment && paymentIntentData.status === "succeeded") {
        return {
          success: false,
          data: `payment intent status is succeeded cannot be re-captured: ${paymentIntentData.id}`,
          status: 304,
        };
      }

      if (isStripePayment) {
        await Stripe.paymentIntents.capture(paymentIntentData.id, {
          stripeAccount: formPayment.stripe_account_id_string,
        });
      }

      const updates = {
        internal_status_updated_by: userId,
        internal_status_updated_at: new Date(),
      };

      if (!isStripePayment) {
        updates.internal_status_id = 3; //approved
      }

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

      if (!isStripePayment) {
        const form_id = formPayment.form_id;
        const form = await Form.findByPk(form_id);
        const groupId = form.group_id;

        var paymentData = await createPayerUser(formattedAnswers, groupId);
        // updates formPayment with payer_id:
        await formPayment.update(paymentData, { valudate: true });
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

  var cancelPaymentIntent = async function (
    paymentIntentId,
    email,
    isUserAction,
    isStripePayment,
  ) {
    try {
      const cancelStatuses = [
        "requires_payment_method",
        "requires_capture",
        "requires_confirmation",
        "requires_action",
      ];

      const preparedInfo = await preparePaymentIntentOperation(
        paymentIntentId,
        email,
        isUserAction, // if it is cash payment, we don't need to check user - payment intent is canceled by the system.
        isStripePayment,
      );

      if (!preparedInfo.success) {
        return preparedInfo;
      }

      const { userId, formPayment, paymentIntentData } = preparedInfo;

      if (
        isStripePayment &&
        !cancelStatuses.includes(paymentIntentData.status)
      ) {
        return {
          success: false,
          error: `payment intent of status succeeded cannot be canceled: ${paymentIntentId}`,
          status: 304,
        };
      }

      var canceledPaymentIntent;
      if (isStripePayment) {
        canceledPaymentIntent = await Stripe.paymentIntents.cancel(
          paymentIntentId,
          { cancellation_reason: "requested_by_customer" },
          {
            stripeAccount: formPayment.stripe_account_id_string,
          },
        );
      } else {
        canceledPaymentIntent = { status: "canceled" };
      }

      const updates = {
        internal_status_updated_by: userId,
        internal_status_updated_at: new Date(),
        internal_status_id: 11, // 'Canceled
        payment_intent_status: canceledPaymentIntent.status,
      };

      await formPayment.update(updates, { validate: true });

      return {
        success: true,
        data: `successfully canceled payment intent: ${canceledPaymentIntent.id}`,
        status: 200,
      };
    } catch (error) {
      return {
        success: false,
        error: `failed to cancel payment intent via stripe api call, error of: ${error.message}`,
        status: 500,
      };
    }
  };

  var createFormPayment = async function (formData) {
    try {
      const formPayment = await FormPayment.create({
        form_id: formData.form_id,
        payment_method_id: formData.payment_method_id || 1, // default to stripe if not provided
        internal_status_id: formData.internal_status_id || 1, // default to 'Pending'
        amount: formData.updatedTotal,
        payment_intent_id: formData.paymentIntentId,
        payment_intent_status: formData.paymentIntentStatus || null,
        stripe_account_id_string: formData.stripeAccountIdString || null,
        response_document_id: formData.response_document_id || null,
      });

      if (!formPayment) {
        return {
          success: false,
          error: `failed to create form payment entry for form id: ${formData.form_id}`,
          status: 500,
        };
      }

      return {
        success: true,
        data: "successfully created form payment intent",
        status: 201,
      };
    } catch (error) {
      return {
        success: false,
        error: `failed to create form payment intent: ${error.message}`,
        status: 500,
      };
    }
  };

  var getPaymentIntent = async function (paymentIntentId, stripeAccountId) {
    try {
      const paymentIntent = await Stripe.paymentIntents.retrieve(
        paymentIntentId,
        {
          stripeAccount: stripeAccountId,
        },
      );

      if (!paymentIntent) {
        return {
          success: false,
          error: `payment intent not found with id: ${paymentIntentId}`,
          status: 404,
        };
      }

      return {
        success: true,
        data: paymentIntent,
      };
    } catch (error) {
      return {
        success: false,
        error: `failed to get payment intent via api call : ${error.message}`,
        status: 500,
      };
    }
  };

  var preparePaymentIntentOperation = async function (
    paymentIntentId,
    email,
    isUserAction,
    isStripePayment,
  ) {
    try {
      var user;

      if (isUserAction) {
        user = await User.findOne({
          where: { email: email },
        });

        if (!user) {
          return {
            success: false,
            error: `no user found with email: ${email}`,
            status: 404,
          };
        }
      }

      const formPayment = await FormPayment.findOne({
        where: { payment_intent_id: paymentIntentId },
      });

      if (!formPayment) {
        return {
          success: false,
          error: `no linked payment found for payment intent id: ${paymentIntentId}`,
          status: 404,
        };
      }

      var retrievePaymentIntent;
      if (isStripePayment) {
        retrievePaymentIntent = await getPaymentIntent(
          paymentIntentId,
          formPayment.stripe_account_id_string,
        );

        if (!retrievePaymentIntent.success) {
          return retrievePaymentIntent;
        }
      } else {
        // for consistency, although this status is not checked for cash payments:
        retrievePaymentIntent = { data: { status: "processing_cash_payment" } };
      }

      return {
        success: true,
        userId: user ? user.id : null,
        formPayment,
        paymentIntentData: retrievePaymentIntent.data,
      };
    } catch (error) {
      return {
        success: false,
        error: `failed to prepare payment intent operation: ${error.message}`,
        status: 500,
      };
    }
  };

  var processPaymentIntent = async function (
    paymentIntentId,
    email,
    formattedAnswers,
    userSelectedStatus,
  ) {
    const isUserAction = true;
    var isStripePayment = false;
    if (paymentIntentId.startsWith("pi_")) {
      isStripePayment = true;
    }
    if (userSelectedStatus === "canceled") {
      return cancelPaymentIntent(
        paymentIntentId,
        email,
        isUserAction,
        isStripePayment,
      );
    } else {
      return capturePaymentIntent(
        paymentIntentId,
        email,
        formattedAnswers,
        userSelectedStatus,
        isUserAction,
        isStripePayment,
      );
    }
  };

  return {
    createAccountConnection,
    createPaymentIntent,
    getAllAccountsByGroupId,
    calculateStripeStatus,
    getPublishableKey,
    capturePaymentIntent,
    processPaymentIntent,
    createFormPayment,
    cancelPaymentIntent,
  };
};

module.exports = AccountController();

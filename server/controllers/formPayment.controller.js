"use strict";

require("dotenv").config();

const { FormPayment, Form } = require("../models");
const Response = require("./../mongoModels/response");
const AccountController = require("./account.controller");
const UserController = require("./user.controller");

const FormPaymentController = function () {
  var connectResponseToFormPayment = async function (responseData, responseId) {
    const paymentEntry = responseData.find(
      (item) => item.field?.type === "payment" && item.paymentIntentId,
    );

    if (!paymentEntry) {
      return;
    }
    try {
      const paymentIntentId = paymentEntry.paymentIntentId;

      let existingFormPayment = await findFormPaymentByPaymentIntentId(
        paymentIntentId,
      );

      const updates = {
        response_document_id: responseId,
      };

      await existingFormPayment.update(updates, { validate: true });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  var updateStripePayment = async function (paymentIntent) {
    try {
      const existingPaymentIntent = await findFormPaymentByPaymentIntentId(
        paymentIntent.id,
      );

      const internalStatusId = mapStripeStatusWithInternalStatus(
        paymentIntent.status,
      );

      const updates = {
        internal_status_id: internalStatusId,
        amount: paymentIntent.amount,
        payment_intent_status: paymentIntent.status,
      };

      await existingPaymentIntent.update(updates, { validate: true });
      await updateMongoPaymentResponse(existingPaymentIntent);

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  var updateMongoPaymentResponse = async function (paymentData) {
    try {
      const documentId = paymentData.response_document_id;
      let response = await Response.findById(documentId);

      if (!response) {
        return;
      }

      let responseData = response.toObject();
      let paymentAnswer = responseData.response.answers.find(
        (answer) => answer.type === "payment" && answer.paymentIntentId,
      );

      paymentAnswer.paymen_type = "stripe_payment";
      paymentAnswer.payment_intent_status = paymentData.payment_intent_status;
      paymentAnswer.amount = paymentData.amount;
      paymentAnswer.payment_intent_auth_by_stripe_at = Date.now();
      if (paymentData.payment_intent_status === "requires_capture") {
        paymentAnswer.payment_intent_capture_by =
          Date.now() + 4 * 24 * 60 * 60 * 1000; // 4 days in milliseconds
      } else if (paymentData.payment_intent_status === "succeeded") {
        paymentAnswer.payment_intent_captured_at = Date.now();
      }

      await Response.updateOne(
        { _id: documentId },
        {
          $set: {
            response: responseData.response,
          },
        },
      );
    } catch (error) {
      throw error;
    }
  };

  var findFormPaymentByPaymentIntentId = async function (paymentIntentId) {
    try {
      const formPayment = await FormPayment.findOne({
        where: {
          payment_intent_id: paymentIntentId,
        },
      });

      if (!formPayment) {
        console.error(
          `no form payment record found with payment intent id: ${paymentIntentId}`,
        );
      }

      return formPayment;
    } catch (error) {
      console.error(error);
    }
  };

  var getFormPaymentByPaymentIntentId = async function (req, res, next) {
    const { payment_intent_id } = req.body;
    try {
      const formPayment = await FormPayment.findOne({
        where: {
          payment_intent_id: payment_intent_id,
        },
      });

      if (!formPayment) {
        res.status(404);
        throw new Error(
          `no form payment record found with payment intent id: ${req.params.payment_intent_id}`,
        );
      }

      return res.status(200).json(formPayment);
    } catch (error) {
      next(error);
    }
  };

  var updatePaymentStatus = async function (req, res, next) {
    try {
      const { payment_intent_id, status, email, answers } = req.body;

      const formPayment = await AccountController.capturePaymentIntent(
        payment_intent_id,
        email,
        answers,
        status,
      );

      return res.status(200).json(formPayment);
    } catch (error) {
      next(error);
    }
  };

  var mapStripeStatusWithInternalStatus = function (paymentIntentStatus) {
    switch (paymentIntentStatus) {
      case "requires_capture":
        return 2; // 'Awaiting Approval'
      case "succeeded":
        return 3; // 'Approved'
      case "requires_payment_method":
        return 5; // 'Processing'
      case "canceled":
        return 11; // 'Cancelled' , did not collect funds before 4-7 experation window
      default:
        return 7; // 'Failed'
    }
  };

  var handleUserUpdateStripe = async function (paymentIntent) {
    const existingPaymentIntent = await findFormPaymentByPaymentIntentId(
      paymentIntent.id,
    );

    // fixe but stoped here
    const form = await Form.findByPk(existingPaymentIntent.form_id);
    const groupId = form?.group_id || null;

    const response = await Response.findById(
      existingPaymentIntent.response_document_id,
    );

    if (!response && !groupId) {
      return;
    }

    const formattedAnswers = response.formatted_answers?.toObject();
    const userSelectedStatus = response.user_selected_status?.toObject();
    if (userSelectedStatus === "approved") {
      const user = getUserDataFromAnswers(formattedAnswers);
      const updatedUser = UserController.createUserViaFromResponse(user);
      return updatedUser;
    }
  };

  var getUserDataFromAnswers = function (formattedAnswers) {
    const user = {
      first_name: formattedAnswers.first_name?.short_text,
      last_name: formattedAnswers.last_name?.short_text,
      email: formattedAnswers.email?.email,
      phone_number: formattedAnswers.phone_number?.phone_number,
      address: formattedAnswers.address?.long_text,
      date: formattedAnswers.date?.date,
      photo: formattedAnswers.photo?.photo,
      signature: formattedAnswers.signature?.short_text,
      liability: formattedAnswers.liability?.liability,
      team_id: formattedAnswers.player?.player?.team_id,
      team_name: formattedAnswers.player?.player?.team_name,
      league_name: formattedAnswers.player?.player?.league_name,
      league_id: formattedAnswers.player?.player?.league_id,
      season_name: formattedAnswers.player?.player?.season_name,
      season_id: formattedAnswers.player?.player?.season_id,
      division_name: formattedAnswers.player?.player?.division_name,
      division_id: formattedAnswers.player?.player?.division_id,
      payment_intent_id: formattedAnswers.payment?.paymentIntentId,
      payment_amount: formattedAnswers.payment?.amount,
      group_id: groupId,
    };
    return user;
  };

  return {
    connectResponseToFormPayment,
    updateStripePayment,
    updateMongoPaymentResponse,
    findFormPaymentByPaymentIntentId,
    getFormPaymentByPaymentIntentId,
    updatePaymentStatus,
    handleUserUpdateStripe,
  };
};

module.exports = FormPaymentController();

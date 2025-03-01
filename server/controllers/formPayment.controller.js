"use strict";

require("dotenv").config();

const { FormPayment, Form, UserStripeAccounts } = require("../models");
const formpayment = require("../models/formpayment");
const Response = require("./../mongoModels/response");
const accountController = require("./account.controller");
const AccountController = require("./account.controller");
const UserController = require("./user.controller");

const FormPaymentController = function () {
  var connectResponseToFormPayment = async function (responseData, responseId) {
    const paymentEntry = responseData.find(
      (item) => item.field?.type === "payment" && item.paymentIntentId,
    );

    if (!paymentEntry) {
      return {
        success: false,
        error: "no payment entry found in response data",
        status: 404,
      };
    }
    try {
      const paymentIntentId = paymentEntry.paymentIntentId;

      let paymentResult = await findFormPaymentByPaymentIntentId(
        paymentIntentId,
      );

      if (!paymentResult.success) {
        return {
          success: false,
          error: paymentResult.message,
          status: paymentResult.status,
        };
      }

      const existingFormPayment = paymentResult.data;

      const updates = {
        response_document_id: responseId,
      };

      await existingFormPayment.update(updates, { validate: true });

      return {
        success: true,
        data: "connected form payment with a document response",
        status: 201,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        status: 500,
      };
    }
  };

  var updateStripePayment = async function (paymentIntent) {
    try {
      const paymentResult = await findFormPaymentByPaymentIntentId(
        paymentIntent.id,
      );

      if (!paymentResult.success) {
        return {
          success: false,
          error: paymentResult.message,
          status: paymentResult.status,
        };
      }

      const existingPaymentIntent = paymentResult.data;

      const internalStatusId = mapStripeStatusWithInternalStatus(
        paymentIntent.status,
      );

      const updates = {
        internal_status_id: internalStatusId,
        amount: paymentIntent.amount,
        payment_intent_status: paymentIntent.status,
      };

      await existingPaymentIntent.update(updates, { validate: true });
      const updatedMongoResponse = await updateMongoPaymentResponse(
        existingPaymentIntent,
      );

      if (!updatedMongoResponse.success) {
        return updatedMongoResponse;
      }

      return {
        success: true,
        data: paymentResult.message,
        status: 201,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: error.message,
        status: 500,
      };
    }
  };

  var updateMongoPaymentResponse = async function (paymentData) {
    try {
      const documentId = paymentData.response_document_id;
      let response = await Response.findById(documentId);

      if (!response) {
        return {
          success: false,
          error: `faiiled to find a response of ${documentId} for the given form payment id of ${paymentData.id}`,
          status: 404,
        };
      }

      let responseData = response.toObject();
      let paymentAnswer = responseData.response.answers.find(
        (answer) => answer.type === "payment" && answer.paymentIntentId,
      );

      paymentAnswer.payment_type = "stripe_payment";
      paymentAnswer.payment_intent_status = paymentData.payment_intent_status;
      paymentAnswer.amount = paymentData.amount;
      paymentAnswer.payment_intent_auth_by_stripe_at = Date.now();
      if (paymentData.payment_intent_status === "requires_capture") {
        paymentAnswer.payment_intent_capture_by =
          Date.now() + 4 * 24 * 60 * 60 * 1000; // 4 days in milliseconds
      } else if (paymentData.payment_intent_status === "succeeded") {
        paymentAnswer.payment_intent_captured_at = Date.now();
      } else if (paymentData.payment_intent_status === "canceled") {
        paymentAnswer.payment_intent_canceled_at = Date.now();
      }

      await Response.updateOne(
        { _id: documentId },
        {
          $set: {
            response: responseData.response,
          },
        },
      );

      return {
        success: true,
        data: `corresponding response updated successfully`,
        status: 201,
      };
    } catch (error) {
      console.warn(`error stack ${error.stack}`);
      return {
        success: false,
        error: `failed to update response document : ${error.message}`,
        status: 500,
      };
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
        return {
          success: false,
          message: `No form payment record found with payment intent id: ${paymentIntentId}`,
          status: 404,
        };
      }

      return {
        success: true,
        data: formPayment,
        message: "Form payment found successfully",
        status: 200,
      };
    } catch (error) {
      return { success: false, message: error.message, status: 500 };
    }
  };

  var getFormPayments = async function (req, res, next) {
    const { form_id } = req.body;

    try {
      let formPayments = [];
      let forms = await Form.findAll({
        where: {
          document_id: form_id,
        },
      });

      for (let form of forms) {
        let payments = await FormPayment.findAll({
          where: {
            form_id: form.id,
          },
        });
        formPayments = formPayments.concat(payments);
      }

      if (!formPayments) {
        res.status(404);
        throw new Error(
          `no form payment record found with form document id: ${req.params.form_id}`,
        );
      }

      return res.status(200).json(formPayments);
    } catch (error) {
      next(error);
    }
  };

  var updatePaymentStatus = async function (req, res, next) {
    try {
      const { payment_intent_id, status, email, answers } = req.body;

      // return res.status(304).json({
      //   status: status,
      //   answers: answers,
      // });

      const { id } = await User.findOne({
        where: { email: email },
      });

      const { stripe_account_id } = await UserStripeAccounts.findOne({
        where: {
          user_id: id,
        },
      });

      let formPayment;
      if (status === "rejected") {
        formPayment = await AccountController.cancelPaymentIntent(
          payment_intent_id,
          stripe_account_id,
        );
      } else {
        formPayment = await AccountController.capturePaymentIntent(
          payment_intent_id,
          email,
          answers,
          status,
        );
      }

      if (!formPayment.success) {
        return res.status(500).json({
          success: false,
          error: "No response received from payment capture",
        });
      }

      return res.status(formPayment.status).json(formPayment.data);
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message || "Internal server error",
      });
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
    try {
      const paymentResult = await findFormPaymentByPaymentIntentId(
        paymentIntent.id,
      );

      if (!paymentResult.success) {
        console.warn(
          `Payment lookup failed for payment intent ${paymentIntent.id.substring(
            0,
            8,
          )}`,
        );
        return {
          success: false,
          error: paymentResult.message,
          status: paymentResult.status,
        };
      }

      const existingPaymentIntent = paymentResult.data;

      const form = await Form.findByPk(existingPaymentIntent.form_id);
      if (!form) {
        console.error(
          `Form not found: ID ${
            existingPaymentIntent.form_id
          } for payment ${paymentIntent.id.substring(0, 8)}`,
        );
        return {
          success: false,
          error: `associated form not found with id: ${existingPaymentIntent.form_id}`,
          status: 404,
        };
      }

      const groupId = form.group_id;

      const response = await Response.findById(
        existingPaymentIntent.response_document_id,
      );

      if (!response) {
        return {
          success: false,
          error: `associated response not found with id: ${existingPaymentIntent.response_document_id}`,
          status: 404,
        };
      }

      const formattedAnswers = response.formatted_answers;
      const userSelectedStatus = response.user_selected_status;

      if (userSelectedStatus === "approved" && formattedAnswers) {
        const user = getUserDataFromAnswers(formattedAnswers, groupId);

        const updatedUserResponse =
          await UserController.createUserViaFromResponse(user);

        return {
          success: updatedUserResponse.success, // could be false or true
          data: updatedUserResponse.data,
          status: updatedUserResponse.status,
        };
      } else {
        console.warn(
          `No user update performed - Status: ${userSelectedStatus}, Formatted answers present: ${!!formattedAnswers}`,
        );
        return {
          success: false,
          error: "no user update made, missing formatted answers data",
          status: 404,
        };
      }
    } catch (error) {
      console.error(error.stack);
      return { success: false, error: error.message, status: 500 };
    }
  };

  var getUserDataFromAnswers = function (formattedAnswers, groupId) {
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

  var updateFormPaymentType = async function (req, res, next) {
    try {
      const { payment_intent_id, payment_method_id } = req.body;

      const formPayment = await FormPayment.findOne({
        where: {
          payment_intent_id: payment_intent_id,
        },
      });

      if (!formPayment) {
        res.status(404);
        throw new Error(
          `no form payment record found with payment intent id: ${payment_intent_id}`,
        );
      }

      await formPayment.update({ payment_method_id });

      return res.status(200).json(formPayment);
    } catch (error) {
      next(error);
    }
  };

  var handleCanceledStripePayment = async function (paymentIntent) {
    try {
      // const cancelableStatuses = [
      //   "requires_payment_method",
      //   "requires_capture",
      //   "requires_confirmation",
      //   "requires_action",
      // ];

      // const stripePaymentIntentStatus = paymentIntent.status;

      // if (!cancelableStatuses.includes(stripePaymentIntentStatus)) {
      //   return {
      //     success: false,
      //     error: `payment intent of id: ${paymentIntent.id}, can not be canceled because it has a status of: ${stripePaymentIntentStatus}`,
      //     status: 400,
      //   };
      // }

      const paymentResult = await findFormPaymentByPaymentIntentId(
        paymentIntent.id,
      );

      if (!paymentResult.success) {
        console.warn(
          `Payment lookup failed for payment intent ${paymentIntent.id.substring(
            0,
            8,
          )}`,
        );
        return paymentResult;
      }

      const formPayment = paymentResult.data;

      // const updates

      // const userStripeAccount = await UserStripeAccounts.findByPk(
      //   formPayment.user_stripe_account_id,
      // );

      // if (!userStripeAccount) {
      //   return {
      //     success: false,
      //     erorr: `no user stripe account found with id: ${formPayment.user_stripe_account_id} . for form payment record of ${formPayment.id}`,
      //     status: 404,
      //   };
      // }

      // const cancelDetails = getCancelDetails(paymentIntent, formPayment);
      // const reason = cancelDetails.reason;
      // const cancelType = cancelDetails.cancelType;
      // const stripeAccountString = userStripeAccount.stripe_account_id;

      //  await FormPayments.update(
      //       {
      //         status: "canceled",
      //         cancel_reason: cancelDetails.reason,
      //         cancel_type: cancelDetails.cancelType,
      //         updated_at: new Date(),
      //       },
      //       { where: { id: formPayment.id } },
      //     );
      // const cancelledPaymentIntent = AccountController.cancelPaymentIntent(
      //   paymentIntent.id,
      //   stripeAccountString,
      //   reason,
      // );

      // if (!cancelledPaymentIntent.success) {
      //   return cancelledPaymentIntent;
      // }

      // now lets see why it got canceled ? User Input or Experation data on payment
    } catch (error) {
      return {
        success: false,
        error: `failed to handle canceled payment intent : ${error.message}`,
        status: 500,
      };
    }
  };

  var getCancelDetails = function (paymentIntent, formPayment) {
    const stripeStatus = paymentIntent.status;
    const stripeCancellationReason = paymentIntent.cancellation_reason;
    const stripeManualCaptureMethod = paymentIntent.capture_method === "manual";
    const internalPaymentMethodId = formPayment.payment_method_id;
    let logReason;
    let cancelType;

    if (internalPaymentMethodId == 2) {
      logReason = `admin canceled through form responses ui on form payment id: ${formPayment.id}`;
      cancelType = "internal-toggle";
    } else if (
      stripeStatus === "canceled" &&
      stripeCancellationReason === "abandoned" &&
      stripeManualCaptureMethod
    ) {
      logReason = `payment intent: ${paymentIntent.id} canceled due to manual capture expiration`;
      cancelType = `payment-intent-expired`;
    } else if (
      stripeStatus === "canceled" &&
      stripeCancellationReason === "requested_by_customer"
    ) {
      logReason = `payment intent: ${paymentIntent.id} canceled by customer request`;
      cancelType = "customer-requested";
    } else if (stripeStatus === "canceled") {
      logReason = `payment intent: ${paymentIntent.id} canceled due to ${
        stripeCancellationReason || "unknown reason"
      }`;
      cancelType = "other";
    }

    return {
      reason,
      cancelType,
    };
  };

  return {
    connectResponseToFormPayment,
    updateStripePayment,
    updateMongoPaymentResponse,
    findFormPaymentByPaymentIntentId,
    getFormPayments,
    updatePaymentStatus,
    handleUserUpdateStripe,
    updateFormPaymentType,
    handleCanceledStripePayment,
  };
};

module.exports = FormPaymentController();

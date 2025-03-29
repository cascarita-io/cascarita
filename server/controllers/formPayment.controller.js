"use strict";

require("dotenv").config();

const {
  FormPayment,
  Form,
  InternalPaymentStatus,
  UserStripeAccounts,
} = require("../models");
const Response = require("./../mongoModels/response");
const AccountController = require("./account.controller");
const createPayerUser = require("../utilityFunctions/createPayerUser");

const FormPaymentController = function () {
  var getFormPaymentsByFormId = async function (form_id) {
    try {
      let form = await Form.findOne({
        where: {
          document_id: form_id,
        },
      });

      let payments = await FormPayment.findAll({
        where: {
          form_id: form.id,
        },
      });

      return {
        success: true,
        data: payments,
        status: 201,
      };
    } catch (error) {
      return {
        success: false,
        error: "failed to find form with form_id",
        status: 500,
      };
    }
  };

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

      const existingFormPaymentIntent = paymentResult.data;

      const internalStatusId = await mapStripeStatusWithInternalStatus(
        paymentIntent.status,
      );

      const updates = {
        internal_status_id: internalStatusId,
        amount: paymentIntent.amount,
        payment_intent_status: paymentIntent.status,
      };

      await existingFormPaymentIntent.update(updates, { validate: true });
      await updateMongoPaymentResponse(
        existingFormPaymentIntent,
        paymentIntent,
      );

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

  var handleStripeRefund = async function (data) {
    try {
      const paymentIntentId = data.payment_intent;

      const paymentResult = await findFormPaymentByPaymentIntentId(
        paymentIntentId,
      );

      if (!paymentResult.success) {
        return {
          success: false,
          error: `error with payment intent when handling a refund: ${paymentResult.message}`,
        };
      }

      const existingFormPayment = paymentResult.data;

      let internalSatus = `refund_${data.status}`;

      if (data.destination_details?.card?.reference_status) {
        const referenceStatus = data.destination_details.card.reference_status;

        if (referenceStatus === "pending") {
          internalSatus = "refund_pending";
        } else if (referenceStatus === "available") {
          internalSatus = "refund_completed";
        } else if (referenceStatus === "unavailable") {
          internalSatus = "refund_failed";
        }
      }

      const ownerOfStripeAccount = await UserStripeAccounts.findOne({
        where: {
          stripe_account_id: existingFormPayment.stripe_account_id_string,
        },
      });

      if (!ownerOfStripeAccount) {
        return {
          success: false,
          error: `failed to find the owner of the stripe account associated with the form payment entry`,
        };
      }

      const updates = {
        internal_status_id: await mapStripeStatusWithInternalStatus(
          internalSatus,
        ),
        internal_status_updated_at: Date.now(),
        // refunds are only possible via Stripe Dashboard. Assume only the owner can create a refund
        internal_status_updated_by: ownerOfStripeAccount.usser_id,
      };

      await existingFormPayment.update(updates, { validate: true });

      data.internal_refund_status = internalSatus;
      const updatedDocumentResponse = await updateRefundMongoResponse(
        existingFormPayment,
        data,
      );

      if (!updatedDocumentResponse.success) {
        return updatedDocumentResponse;
      }

      const isUpdate = data.refund_event_type === "refund.updated";
      // if (isUpdate && internalSatus === "refund_completed") {
      //   // TODO: send refund email
      //   // TODO: REMOVE USER ?
      // }
      return {
        success: true,
        data: isUpdate
          ? "updated form payment with refund status and sent email to user"
          : "updated form payment with refund status",
      };
    } catch (error) {
      return {
        success: false,
        error: `failed to handle refund with error : ${error.message}`,
      };
    }
  };

  var updateMongoPaymentResponse = async function (
    paymentData,
    stripePaymentIntent,
  ) {
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

      paymentAnswer.payment_type = "stripe_payment";
      paymentAnswer.payment_intent_status = stripePaymentIntent.status;
      paymentAnswer.amount = stripePaymentIntent.amount;
      paymentAnswer.payment_intent_auth_by_stripe_at = Date.now();
      if (paymentData.payment_intent_status === "requires_capture") {
        paymentAnswer.payment_intent_capture_by =
          Date.now() + 4 * 24 * 60 * 60 * 1000; // 4 days in milliseconds
      } else if (paymentData.payment_intent_status === "succeeded") {
        paymentAnswer.payment_intent_captured_at = Date.now();
      } else if (paymentData.payment_intent_status === "canceled") {
        paymentAnswer.cancellation_reason =
          stripePaymentIntent.cancellation_reason;
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

  var updateRefundMongoResponse = async function (formPayment, refundData) {
    try {
      const documentId = formPayment.response_document_id;
      let response = await Response.findById(documentId);

      if (!response) {
        return {
          success: false,
          error: `failed to find a response with porvided document id: ${documentId}`,
        };
      }
      let responseData = response.toObject();

      let paymentAnswer = responseData.response.answers.find(
        (answer) => answer.type === "payment" && answer.paymentIntentId,
      );

      paymentAnswer.stripe_refund_status = refundData.internal_refund_status;
      paymentAnswer.stripe_refunded_at = Date.now();

      const updateDocument = await Response.updateOne(
        { _id: documentId },
        {
          $set: {
            response: responseData.response,
          },
        },
      );

      if (!updateDocument) {
        return {
          success: false,
          error: `failed to update refund data for document id: ${documentId} `,
        };
      }

      return {
        success: true,
        data: `response document updated successfully with refund data`,
      };
    } catch (error) {
      console.warn({
        error_stack: error.stack,
      });
      return {
        success: false,
        error: `failed update document response with refund data: ${error.message}`,
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
      const formPayments = await getFormPaymentsByFormId(form_id);

      if (!formPayments.success) {
        console.warn("failed to find form with form_id");
        return res.status(formPayments.success).json(formPayments.error);
      }

      const completedFormPayment = formPayments.data.filter(
        (payment) => payment.response_document_id,
      );

      return res.status(200).json(completedFormPayment);
    } catch (error) {
      next(error);
    }
  };

  var updatePaymentStatus = async function (req, res) {
    try {
      const { payment_intent_id, status, email, answers } = req.body;

      const formPayment = await AccountController.processPaymentIntent(
        payment_intent_id,
        email,
        answers,
        status,
      );

      if (!formPayment.success) {
        return res.status(formPayment.status).json({
          success: false,
          error: `process faled with error of : ${formPayment.error} `,
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

  var mapStripeStatusWithInternalStatus = async function (stripeDataStatus) {
    let statusDbCode;

    switch (stripeDataStatus) {
      case "requires_capture":
        statusDbCode = "awaiting_approval";
        break;
      case "succeeded":
        statusDbCode = "approved";
        break;
      case "requires_payment_method":
        statusDbCode = "processing";
        break;
      case "canceled":
        statusDbCode = "cancelled";
        break;
      case "refund_pending":
        statusDbCode = "refund_pending";
        break;
      case "refund_requires_action":
        statusDbCode = "refund_requires_action";
        break;
      case "refund_succeeded":
        statusDbCode = "refunded";
        break;
      case "refund_failed":
        statusDbCode = "refund_failed";
        break;
      case "refund_canceled":
        statusDbCode = "refund_canceled";
        break;
      default:
        statusDbCode = "failed";
    }

    try {
      const status = await InternalPaymentStatus.findOne({
        where: { code: statusDbCode },
      });

      return status ? status.id : 7;
    } catch (error) {
      console.error({
        meesage: `failed to get internal status id from code`,
        error: error,
        stack: error.stack,
      });
      return 7;
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

      const existingFormPayment = paymentResult.data;

      const form = await Form.findByPk(existingFormPayment.form_id);
      if (!form) {
        console.error(
          `Form not found: ID ${
            existingFormPayment.form_id
          } for payment ${paymentIntent.id.substring(0, 8)}`,
        );
        return {
          success: false,
          error: `associated form not found with id: ${existingFormPayment.form_id}`,
          status: 404,
        };
      }

      const groupId = form.group_id;

      const response = await Response.findById(
        existingFormPayment.response_document_id,
      );

      if (!response) {
        return {
          success: false,
          error: `associated response not found with id: ${existingFormPayment.response_document_id}`,
          status: 404,
        };
      }

      const formattedAnswers = response.formatted_answers;
      const userSelectedStatus = response.user_selected_status;

      if (!userSelectedStatus === "succeeded" && !formattedAnswers) {
        console.warn(
          `No user update performed - Status: ${userSelectedStatus}, Formatted answers present: ${!!formattedAnswers}`,
        );
        return {
          success: false,
          error: "no user update made, missing formatted answers data",
          status: 404,
        };
      }

      const paymentData = await createPayerUser(formattedAnswers, groupId);

      await existingFormPayment.update(paymentData, { valudate: true });

      return {
        success: true,
        data: `user created and linked to form payment of: ${existingFormPayment.id}`,
        status: 201,
      };
    } catch (error) {
      console.error(error.stack);
      return { success: false, error: error.message, status: 500 };
    }
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

  return {
    getFormPaymentsByFormId,
    connectResponseToFormPayment,
    updateStripePayment,
    updateMongoPaymentResponse,
    findFormPaymentByPaymentIntentId,
    getFormPayments,
    updatePaymentStatus,
    handleUserUpdateStripe,
    updateFormPaymentType,
    handleStripeRefund,
  };
};

module.exports = FormPaymentController();

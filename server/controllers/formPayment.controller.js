"use strict";

require("dotenv").config();

const { FormPayment } = require("../models");
const { Form: SQLForm } = require("../models");
const MongoForm = require("../mongoModels/form");
const Response = require("./../mongoModels/response");

const FormPaymentController = {
  async connectResponseToFormPayment(responseData, responseId) {
    const paymentEntry = responseData.find(
      (item) => item.field?.type === "payment" && item.paymentIntentId,
    );

    if (!paymentEntry) {
      return;
    }
    try {
      const paymentIntentId = paymentEntry.paymentIntentId;

      let existingFormPayment = await this.findFormPaymentByPaymentIntentId(
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
  },

  async updateStripePayment(paymentIntent) {
    try {
      const existingPaymentIntent = await this.findFormPaymentByPaymentIntentId(
        paymentIntent.id,
      );

      const updates = {
        internal_status_id: 2, // set it to 'Awaiting Approval'
        amount: paymentIntent.amount,
        payment_intent_status: paymentIntent.status,
      };

      await existingPaymentIntent.update(updates, { validate: true });
      await this.updateMongoPaymentResponse(existingPaymentIntent);

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  async updateMongoPaymentResponse(paymentData) {
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

      if (paymentAnswer) {
        paymentAnswer.paymen_type = "stripe_payment";
        paymentAnswer.payment_intent_status = paymentData.payment_intent_status;
        paymentAnswer.amount = paymentData.amount;
        paymentAnswer.payment_intent_auth_by_stripe_at = Date.now();
        if (paymentData.payment_intent_status === "requires_capture") {
          paymentAnswer.payment_intent_capture_by =
            Date.now() + 4 * 24 * 60 * 60 * 1000; // 4 days in milliseconds
        }

        await Response.updateOne(
          { _id: documentId },
          {
            $set: {
              response: responseData.response,
            },
          },
        );
      }
    } catch (error) {
      throw error;
    }
  },

  async createStripeFormPayment(formData) {
    await FormPayment.create({
      form_id: formData.form_id,
      payment_method_id: 1, //since this go triggred, it is stripe payment
      internal_status_id: 1, // set it to default 'Pending'
      amount: formData.transactionAmount,
      payment_intent_id: formData.paymentIntentId,
      payment_intent_status: formData.paymentIntentStatus,
      user_stripe_account_id: formData.userStripeAccountSqlId,
    });
  },

  async findFormPaymentByPaymentIntentId(paymentIntentId) {
    try {
      const formPayment = await FormPayment.findOne({
        where: {
          payment_intent_id: paymentIntentId,
        },
      });

      if (!formPayment) {
        res.status(404);
        throw new Error(
          `no form payment record found with payment intent id: ${paymentIntent.id}`,
        );
      }

      return formPayment;
    } catch (error) {
      throw error;
    }
  },

  async getFormPayments(req, res, next) {
    const { form_id } = req.body;

    try {
      let formPayments = [];
      let forms = await SQLForm.findAll({
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
  },

  async updatePaymentStatus(req, res, next) {
    try {
      const { payment_intent_id, status } = req.body;

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

      await formPayment.update({ payment_intent_status: status });

      return res.status(200).json(formPayment);
    } catch (error) {
      next(error);
    }
  },

  async updateFormPaymentType(req, res, next) {
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
  },
};

module.exports = FormPaymentController;

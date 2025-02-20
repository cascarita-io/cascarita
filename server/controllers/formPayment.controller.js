"use strict";

require("dotenv").config();

const { FormPayment } = require("../models");

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

      return true;
    } catch (error) {
      console.error(error);
      return false;
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
};

module.exports = FormPaymentController;

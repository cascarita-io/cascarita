"use strict";

require("dotenv").config();

const { FormPayment } = require("../models");

const FormPaymentController = {
  async connectResponseToFormPayment(responseData, responseId) {
    const paymentFieldIndex = responseData.findIndex(
      (item) => item?.field?.type === "payment",
    );

    if (!paymentFieldIndex) {
      return;
    }
    try {
      const paymentIntentId = responseData[paymentFieldIndex + 1];

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

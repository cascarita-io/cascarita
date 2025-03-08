"use strict";

require("dotenv").config();

const Response = require("./../mongoModels/response");
const FormMongo = require("./../mongoModels/form");
const { Form, User } = require("../models");
const FormPaymentController = require("./formPayment.controller");
const generatePaymentIntentId = require("../utilityFunctions/paymentIntents");
const AccountController = require("./account.controller");

const FormController = function () {
  var getAllForms = async function (req, res, next) {
    try {
      const mongoForms = await FormMongo.find({
        group_id: { $in: req.params.id },
      }).select("form_data.title created_by updated_by createdAt updatedAt");

      return res.status(201).json(mongoForms);
    } catch (error) {
      next(error);
    }
  };
  var createResponse = async function (req, res, next) {
    try {
      const responseData = req.body.data;
      const doc_form_id = req.body.form_id
      const insertedResponse = new Response({
        form_id: doc_form_id,
        response: {
          answers: responseData,
        },
      });

      const paymentEntry = responseData.find(
      (item) => item.field?.type === "payment",
      );

      const hasCashPayment = (paymentEntry && paymentEntry.payment_type === "cash");

      if (hasCashPayment) {

        /* TEMPORARY SOLUTION TO CANCEL THE STRIPE PAYMENT INTENT */
        const paymentIntentToCancel = paymentEntry.paymentIntentId;
        var cancelRes = await AccountController.cancelPaymentIntent(paymentIntentToCancel, null, hasCashPayment);
        if (!cancelRes.success) {
          return res.status(cancelRes.status).json({ error: cancelRes.error });
        }
        /* END OF TEMP BLOCK */

        paymentEntry.amount = paymentEntry.amount * 100; //convert to cents
        const cashPaymentIntentId = generatePaymentIntentId();
        paymentEntry.paymentIntentId = cashPaymentIntentId;
      }

      // Save the response to the mongo database
      await insertedResponse.save();
      const responseIdString = insertedResponse.id;

      var response;
      // Splits into cash flow
      if (hasCashPayment) {
        const form = await Form.findOne({ where: { document_id: doc_form_id } });
        const form_id = form.id;

        const paymentData = {
          form_id: form_id,
          payment_method_id: 2, //cash
          internal_status_id: 1, //pending
          updatedTotal: paymentEntry.amount,
          paymentIntentId: paymentEntry.paymentIntentId,
          response_document_id: responseIdString,
        };

        // create cash FormPayment
        response = await AccountController.createFormPayment(paymentData);
      } else {
        // Handle stripe payment response:
        response = await FormPaymentController.connectResponseToFormPayment(
            responseData,
            responseIdString,
          );
      }

      if (!response.success) {
        return res.status(response.status).json({ error: response.message });
      } else {
        return res.status(response.status).json(response.data);
      }
    } catch (error) {
      next(error);
    }
  };
  var getResponsesByFormId = async function (req, res, next) {
    try {
      const responses = await Response.find({
        form_id: req.params.form_id,
      });
      return res.status(200).json(responses);
    } catch (error) {
      next(error);
    }
  };
  var createForm = async function (req, res, next) {
    try {
      const form_data = { title: req.body.title, fields: req.body.fields };

      let form_type = 1;
      if (req.body.template !== "registration") {
        form_type = 2;
      }

      const user = await User.findByPk(req.params.user_id);
      if (!user) {
        res.status(404);
        throw new Error(`no user was found with id ${req.params.user_id}`);
      }

      const createdBy = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      };

      const form = new FormMongo({
        group_id: req.params.group_id,
        created_by: createdBy,
        updated_by: null,
        form_data: form_data,
        form_blueprint: req.body,
      });

      const result = await form.save();

      const newForm = {
        group_id: req.params.group_id,
        created_by: req.params.user_id,
        updated_by: null,
        document_id: result.id,
        form_type: form_type,
      };

      await Form.build(newForm).validate();
      await Form.create(newForm);

      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  var getFormByDocumentId = async function (req, res, next) {
    try {
      const form_document_id = req.params.document_id;
      let data;

      let form = await FormMongo.findById(form_document_id);
      if (!form) {
        data = [];
      } else {
        data = form.toObject();
        const sqlFormData = await Form.findOne({
          where: {
            document_id: form_document_id,
          },
        });
        data.sql_form_id = sqlFormData
          ? sqlFormData.id
          : `no sql form found for ${form_document_id}`;
        data.form_type = sqlFormData ? sqlFormData.form_type : 0;
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  var updateForm = async function (req, res, next) {
    const { form_id } = req.params;
    try {
      const formResponse = await Form.findOne({
        where: {
          document_id: form_id,
        },
      });
      if (!formResponse) {
        res.status(404);
        throw new Error(`no form with id ${form_id}`);
      }

      const responses = await Response.find({
        form_id: req.params.form_id,
      });

      if (Object.keys(responses).length !== 0) {
        res.status(401);
        throw new Error(
          `cannot edit form with form id (${form_id}) as it already has responses`,
        );
      }

      const sqlFields = ["group_id", "created_by", "updated_by"];
      const mongoFields = [
        "form_data",
        "form_blueprint",
        "group_id",
        "updated_by",
      ];

      const sqlUpdateData = {};
      const mongoUpdateData = {};

      Object.keys(req.body).forEach((key) => {
        if (sqlFields.includes(key)) {
          sqlUpdateData[key] = req.body[key];
        }
        if (mongoFields.includes(key)) {
          mongoUpdateData[key] = req.body[key];
        }
      });

      Object.keys(sqlUpdateData).forEach((key) => {
        if (key === "updated_by") {
          formResponse[key] = sqlUpdateData[key].id
            ? sqlUpdateData[key].id
            : formResponse[key];
        } else {
          formResponse[key] = sqlUpdateData[key]
            ? sqlUpdateData[key]
            : formResponse[key];
        }
      });

      await formResponse.validate();
      await formResponse.save();

      if (Object.keys(mongoUpdateData).length > 0) {
        await FormMongo.updateOne(
          { _id: form_id },
          {
            $set: mongoUpdateData,
            $currentDate: { updatedAt: true },
          },
        );
      }

      res.status(200).json(formResponse);
    } catch (error) {
      next(error);
    }
  };
  var deleteForm = async function (req, res, next) {
    const { form_id } = req.params;
    try {
      const formResponse = await Form.findOne({
        where: {
          document_id: form_id,
        },
      });
      if (!formResponse) {
        res.status(404);
        throw new Error(`no form with form id: ${form_id}`);
      }

      await formResponse.destroy();

      await Response.deleteMany({ form_id: form_id });

      await FormMongo.deleteOne({ _id: form_id });

      res.status(204).json();
    } catch (error) {
      next(error);
    }
  };

  return {
    getAllForms,
    createResponse,
    getResponsesByFormId,
    createForm,
    getFormByDocumentId,
    updateForm,
    deleteForm,
  };
};

module.exports = FormController();

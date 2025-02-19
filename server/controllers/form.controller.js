"use strict";

require("dotenv").config();

const Response = require("./../mongoModels/response");
const FormMongo = require("./../mongoModels/form");
const { Form, User, FormPayment } = require("../models");

const FormController = {
  async getAllForms(req, res, next) {
    try {
      const mongoForms = await FormMongo.find({
        group_id: { $in: req.params.id },
      }).select("form_data.title created_by updated_by createdAt updatedAt");

      return res.status(201).json(mongoForms);
    } catch (error) {
      next(error);
    }
  },
  async createResponse(req, res, next) {
    try {
      const insertedResponse = new Response({
        form_id: req.body.form_id,
        response: {
          answers: req.body.data,
        },
      });

      await insertedResponse.save();

      return res.status(201).json(insertedResponse);
    } catch (error) {
      next(error);
    }
  },
  async getResponsesByFormId(req, res, next) {
    try {
      const responses = await Response.find({
        form_id: req.params.form_id,
      });

      return res.status(201).json(responses);
    } catch (error) {
      next(error);
    }
  },
  async createForm(req, res, next) {
    try {
      const form_data = { title: req.body.title, fields: req.body.fields };

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
        form_type: 1, // temp, only type on DB table and allowNull is False
      };

      await Form.build(newForm).validate();
      await Form.create(newForm);

      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async getFormByDocumentId(req, res, next) {
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
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  async updateForm(req, res, next) {
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
  },
  async deleteForm(req, res, next) {
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
  },

  async updateStripePayment(paymentIntent) {
    try {
      const existingPaymentIntent = await FormPayment.findOne({
        where: {
          payment_intent_id: paymentIntent.id,
        },
      });

      if (!existingPaymentIntent) {
        res.status(404);
        throw new Error(
          `no form payment record found with payment intent id: ${paymentIntent.id}`,
        );
      }

      const updates = {
        internal_status_id: 2, // set it to 'Awaiting Approval'
        amount: paymentIntent.amount,
        payment_intent_status: paymentIntent.status,
      };

      await existingPaymentIntent.update(updates, { validate: true });

      //TODO: Need to update existing response in the mongo collection

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
};

module.exports = FormController;

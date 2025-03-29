"use strict";

const { Fields } = require("../models");

const FieldController = function () {
  var getFieldByGroupId = async function (req, res, next) {
    const groupId = req.params.id;

    try {
      const result = await Fields.findAll({
        where: {
          group_id: groupId,
        },
      });

      if (Object.keys(result).length === 0) {
        throw new Error("group with given id has no fields");
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  var isNameUniqueWithinGroup = async function (groupId, fieldName) {
    let fieldFound = await Fields.findOne({
      where: {
        group_id: groupId,
        name: fieldName,
      },
    });

    return fieldFound == null;
  };

  var createField = async function (req, res, next) {
    const { group_id, name, address, length, width } = req.body;
    const newField = { group_id, name, address, length, width };

    try {
      const fieldFound = await isNameUniqueWithinGroup(
        newField.group_id,
        newField.name,
        newField.address,
        newField.length,
        newField.width,
      );

      if (!fieldFound) {
        res.status(400);
        throw new Error("name is not unique");
      }

      await Fields.build(newField).validate();
      const result = await Fields.create(newField);

      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  var updateField = async function (req, res, next) {
    try {
      let currentField = await Fields.findOne({
        where: {
          id: req.params["id"],
        },
      });

      if (!currentField) {
        res.status(400);
        throw new Error("field with given id was not found");
      }

      Object.keys(req.body).forEach((key) => {
        if (key !== "group_id") {
          currentField[key] = req.body[key] ? req.body[key] : currentField[key];
        }
      });

      const fieldFound = await isNameUniqueWithinGroup(
        currentField.group_id,
        currentField.name,
        currentField.address,
        currentField.length,
        currentField.width,
      );

      if (!fieldFound) {
        res.status(400);
        throw new Error("name is not unique");
      }

      await currentField.validate();
      await currentField.save();

      return res.status(200).json(currentField);
    } catch (error) {
      next(error);
    }
  };

  var deleteField = async function (req, res, next) {
    try {
      let deletedField = await Fields.destroy({
        where: {
          id: req.params["id"],
        },
      });

      if (deletedField === 0) {
        throw new Error("no field found with the given id");
      }

      return res.status(204).json();
    } catch (error) {
      next(error);
    }
  };

  return {
    getFieldByGroupId,
    createField,
    updateField,
    deleteField,
  };
};

module.exports = FieldController();

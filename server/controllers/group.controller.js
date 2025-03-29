"use strict";
const crypto = require("crypto");
const { Group } = require("../models");

const GroupController = function () {
  var findGroupById = async function (id) {
    let currentGroup = await Group.findOne({
      where: {
        id: id,
      },
    });

    return currentGroup;
  };

  var getGroupById = async function (req, res, next) {
    try {
      const group = await findGroupById(req.params["id"]);
      if (!group) {
        res
          .status(404)
          .json({ error: `no group was found with id ${req.params["id"]}` });
        return;
      }

      return res.status(200).json(group);
    } catch (error) {
      next(error);
    }
  };

  var getAllGroups = async function (req, res, next) {
    try {
      let allGroups = await Group.findAll();
      return res.status(200).json(allGroups);
    } catch (error) {
      next(error);
    }
  };

  var createGroup = async function (groupInfo) {
    const uniqueCode = await generateUniqueGroupCode();

    const newGroup = {
      name: groupInfo.name,
      street_address: groupInfo.street_address,
      city: groupInfo.city,
      state: groupInfo.state,
      zip_code: groupInfo.zip_code,
      logo_url: groupInfo.logo_url,
      group_code: uniqueCode,
    };

    try {
      await Group.build(newGroup).validate();
      const createdGroup = await Group.create(newGroup);
      return createdGroup.id;
    } catch (error) {
      console.error("error creating group: ", error);
      throw new Error("failed to create group");
    }
  };

  var updateGroup = async function (req, res, next) {
    try {
      let currentGroup = await findGroupById(req.params["id"]);

      if (!currentGroup) {
        res
          .status(404)
          .json({ error: `no group was found with id ${req.params["id"]}` });
        return;
      }

      Object.keys(req.body).forEach((key) => {
        currentGroup[key] = req.body[key] ? req.body[key] : currentGroup[key];
      });

      await currentGroup.validate();
      await currentGroup.save();

      return res.status(200).json(currentGroup);
    } catch (error) {
      next(error);
    }
  };

  function generateHexCode() {
    return crypto.randomBytes(4).toString("hex");
  }

  var generateUniqueGroupCode = async function () {
    const maxAttempts = 10;
    let attempts = 0;
    let uniqueCode;

    while (attempts < maxAttempts) {
      uniqueCode = generateHexCode();

      // Check if the code already exists in the database
      const existingGroup = await Group.findOne({
        where: { group_code: uniqueCode },
      });

      if (!existingGroup) {
        return uniqueCode;
      }

      attempts++;
    }

    throw new Error("failed to generate a unique group code after 10 attempts");
  };

  return {
    findGroupById,
    getGroupById,
    getAllGroups,
    createGroup,
    updateGroup,
  };
};

module.exports = GroupController();